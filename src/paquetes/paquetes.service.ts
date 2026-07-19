import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';

import { Paquete } from './entities/paquete.entity';
import { PaqueteImagen } from './entities/paquete-imagen.entity';
import { Destino } from '../destinos/entities/destino.entity';
import { DestinoImagen } from '../destinos/entities/destino-imagen.entity';
import { CreatePaqueteDto } from './dto/create-paquete.dto';
import { UpdatePaqueteDto } from './dto/update-paquete.dto';

@Injectable()
export class PaquetesService {
  constructor(
    @InjectRepository(Paquete)
    private readonly paqueteRepository: Repository<Paquete>,
    @InjectRepository(PaqueteImagen)
    private readonly paqueteImagenRepository: Repository<PaqueteImagen>,
    @InjectRepository(DestinoImagen)
    private readonly destinoImagenRepository: Repository<DestinoImagen>,
  ) {}

  private validarFechas(fechaInicio: string, fechaFin: string) {
    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      throw new BadRequestException(
        'La fecha de fin debe ser posterior a la fecha de inicio',
      );
    }
  }

  async create(dto: CreatePaqueteDto): Promise<Paquete> {
    this.validarFechas(dto.fechaInicio, dto.fechaFin);

    const paquete = this.paqueteRepository.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      precio: dto.precio,
      cupos: dto.cupos,
      fechaInicio: dto.fechaInicio,
      fechaFin: dto.fechaFin,
      destino: { id: dto.destinoId } as Destino,
      imagenPrincipal: dto.imagenPrincipal ?? dto.imagenes?.[0],
    });

    let guardado: Paquete;
    try {
      guardado = await this.paqueteRepository.save(paquete);
    } catch (error) {
      if (this.isForeignKeyViolation(error)) {
        throw new BadRequestException('El destino indicado no existe');
      }
      throw error;
    }

    if (dto.imagenes && dto.imagenes.length > 0) {
      const principal = dto.imagenPrincipal ?? dto.imagenes[0];
      await this.paqueteImagenRepository.save(
        dto.imagenes.map((url) =>
          this.paqueteImagenRepository.create({
            paquete: { id: guardado.id } as Paquete,
            url,
            esPrincipal: url === principal,
          }),
        ),
      );
    } else {
      // No se subieron imágenes propias: hereda la galería del destino
      // para que el paquete nunca quede sin imagen en cards/listados.
      await this.heredarImagenesDeDestino(guardado.id, dto.destinoId);
    }

    return this.findOne(guardado.id);
  }

  /**
   * Copia la galería de imágenes del destino hacia el paquete recién
   * creado (mismas urls, filas propias en paquete_imagenes) y replica
   * cuál es la principal. No hace nada si el destino tampoco tiene
   * imágenes todavía.
   */
  private async heredarImagenesDeDestino(
    paqueteId: number,
    destinoId: number,
  ): Promise<void> {
    const imagenesDestino = await this.destinoImagenRepository.find({
      where: { destinoId },
      order: { createdAt: 'ASC' },
    });

    if (imagenesDestino.length === 0) {
      return;
    }

    await this.paqueteImagenRepository.save(
      imagenesDestino.map((img) =>
        this.paqueteImagenRepository.create({
          paquete: { id: paqueteId } as Paquete,
          url: img.url,
          esPrincipal: img.esPrincipal,
        }),
      ),
    );

    const principal =
      imagenesDestino.find((i) => i.esPrincipal) ?? imagenesDestino[0];
    await this.paqueteRepository.update(paqueteId, {
      imagenPrincipal: principal.url,
    });
  }

  /**
   * Listado público: visitantes y clientes ven exactamente lo mismo,
   * solo paquetes activos.
   */
  async findAll(): Promise<Paquete[]> {
    return this.paqueteRepository.find({
      where: { activo: true },
      relations: { destino: true, imagenes: true },
      order: { fechaInicio: 'ASC' },
    });
  }

  /** Listado para el panel admin: incluye paquetes desactivados. */
  async findAllAdmin(): Promise<Paquete[]> {
    return this.paqueteRepository.find({
      relations: { destino: true, imagenes: true },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Búsqueda full-text sobre paquetes (nombre, descripción). Requiere
   * el trigger de sql/002-paquete-search-trigger.sql (Script-26.sql
   * original solo tenía el índice GIN, sin trigger que llenara la
   * columna — ver nota en el entity).
   */
  async buscar(q: string): Promise<Paquete[]> {
    if (!q || !q.trim()) {
      return this.findAll();
    }

    return this.paqueteRepository
      .createQueryBuilder('paquete')
      .leftJoinAndSelect('paquete.destino', 'destino')
      .where('paquete.activo = true')
      .andWhere(
        `paquete.search_vector @@ plainto_tsquery('spanish', unaccent(:q))`,
        { q },
      )
      .orderBy(
        `ts_rank(paquete.search_vector, plainto_tsquery('spanish', unaccent(:q)))`,
        'DESC',
      )
      .getMany();
  }

  async findOne(id: number): Promise<Paquete> {
    const paquete = await this.paqueteRepository.findOne({
      where: { id },
      relations: { destino: true, imagenes: true },
    });

    if (!paquete) {
      throw new NotFoundException('Paquete no encontrado');
    }

    return paquete;
  }

  async update(id: number, dto: UpdatePaqueteDto): Promise<Paquete> {
    const paquete = await this.findOne(id);

    const fechaInicio = dto.fechaInicio ?? paquete.fechaInicio;
    const fechaFin = dto.fechaFin ?? paquete.fechaFin;
    this.validarFechas(fechaInicio, fechaFin);

    const { destinoId, limpiarPrecioAnterior, ...resto } = dto;

    // Rebaja de precio: si el nuevo precio es menor al actual, se guarda
    // el precio actual como "precioAnterior" para que la vitrina lo
    // muestre tachado (número mayor tachado, precio nuevo destacado).
    // Esto es puramente para la vitrina pública: nunca toca cifras de
    // finanzas/reservas ni reemplaza el registro en "auditoria" (que ya
    // guarda automáticamente precio viejo y nuevo en cada UPDATE, ver
    // auditoria.subscriber.ts) — es decir, un cambio de precio del
    // catálogo jamás se contabiliza como ingreso, pérdida, robo o
    // estafa; esos se registran aparte en movimientos_financieros.
    if (
      typeof resto.precio === 'number' &&
      resto.precio < Number(paquete.precio)
    ) {
      paquete.precioAnterior = Number(paquete.precio);
    }

    Object.assign(paquete, resto);

    if (destinoId) {
      paquete.destino = { id: destinoId } as Destino;
    }

    let guardado: Paquete;
    try {
      guardado = await this.paqueteRepository.save(paquete);
    } catch (error) {
      if (this.isForeignKeyViolation(error)) {
        throw new BadRequestException('El destino indicado no existe');
      }
      throw error;
    }

    // save() ignora propiedades "undefined" (no las manda a la BD), así
    // que limpiar precioAnterior necesita un UPDATE explícito con null.
    if (limpiarPrecioAnterior) {
      await this.paqueteRepository
        .createQueryBuilder()
        .update(Paquete)
        .set({ precioAnterior: () => 'NULL' })
        .where('id = :id', { id })
        .execute();
      guardado.precioAnterior = undefined;
    }

    return guardado;
  }

  async remove(id: number): Promise<void> {
    const paquete = await this.findOne(id);

    try {
      await this.paqueteRepository.remove(paquete);
    } catch (error) {
      if (this.isForeignKeyViolation(error)) {
        throw new ConflictException(
          'No se puede eliminar: hay reservas, ofertas o cotizaciones asociadas a este paquete. Desactívalo en su lugar.',
        );
      }
      throw error;
    }
  }

  private isForeignKeyViolation(error: unknown): boolean {
    return (
      error instanceof QueryFailedError &&
      (error as unknown as { code?: string }).code === '23503'
    );
  }

  // --- Galería de imágenes ---

  async agregarImagen(paqueteId: number, url: string): Promise<PaqueteImagen> {
    const paquete = await this.findOne(paqueteId);

    const esPrimera = !paquete.imagenes || paquete.imagenes.length === 0;

    const imagen = this.paqueteImagenRepository.create({
      paquete: { id: paqueteId } as Paquete,
      url,
      esPrincipal: esPrimera,
    });

    const guardada = await this.paqueteImagenRepository.save(imagen);

    if (esPrimera) {
      await this.paqueteRepository.update(paqueteId, { imagenPrincipal: url });
    }

    return guardada;
  }

  async eliminarImagen(paqueteId: number, imagenId: number): Promise<void> {
    const imagen = await this.paqueteImagenRepository.findOne({
      where: { id: imagenId, paqueteId },
    });

    if (!imagen) {
      throw new NotFoundException('Imagen no encontrada para este paquete');
    }

    const eraPrincipal = imagen.esPrincipal;
    await this.paqueteImagenRepository.remove(imagen);

    if (eraPrincipal) {
      const siguiente = await this.paqueteImagenRepository.findOne({
        where: { paqueteId },
        order: { createdAt: 'ASC' },
      });

      if (siguiente) {
        siguiente.esPrincipal = true;
        await this.paqueteImagenRepository.save(siguiente);
      }

      await this.paqueteRepository.update(paqueteId, {
        imagenPrincipal: siguiente?.url,
      });
    }
  }

  /** Marca una imagen de la galería como la "de perfil" del paquete. */
  async marcarPrincipal(
    paqueteId: number,
    imagenId: number,
  ): Promise<PaqueteImagen> {
    const imagen = await this.paqueteImagenRepository.findOne({
      where: { id: imagenId, paqueteId },
    });

    if (!imagen) {
      throw new NotFoundException('Imagen no encontrada para este paquete');
    }

    await this.paqueteImagenRepository.update(
      { paqueteId },
      { esPrincipal: false },
    );
    imagen.esPrincipal = true;
    await this.paqueteImagenRepository.save(imagen);

    await this.paqueteRepository.update(paqueteId, {
      imagenPrincipal: imagen.url,
    });

    return imagen;
  }
}
