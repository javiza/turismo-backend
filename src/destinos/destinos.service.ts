import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';

import { Destino } from './entities/destino.entity';
import { DestinoImagen } from './entities/destino-imagen.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { CreateDestinoDto } from './dto/create-destino.dto';
import { UpdateDestinoDto } from './dto/update-destino.dto';
import { CacheService } from '../redis/cache.service';

/** Prefijo de todas las claves de caché de este módulo (para invalidar todo junto). */
const CACHE_PREFIX = 'destinos:';
const CACHE_TTL_SEGUNDOS = 300; // 5 min: el catálogo cambia poco y se lee mucho

@Injectable()
export class DestinosService {
  constructor(
    @InjectRepository(Destino)
    private readonly destinoRepository: Repository<Destino>,
    @InjectRepository(DestinoImagen)
    private readonly destinoImagenRepository: Repository<DestinoImagen>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    private readonly cache: CacheService,
  ) {}

  /** Invalida todo lo cacheado de destinos (listados, búsquedas y detalle). */
  private invalidarCache(): Promise<void> {
    return this.cache.delByPrefix(CACHE_PREFIX);
  }

  private validarFechas(fechaInicio: string, fechaFin: string) {
    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      throw new BadRequestException(
        'La fecha de fin debe ser posterior a la fecha de inicio',
      );
    }
  }

  async create(dto: CreateDestinoDto): Promise<Destino> {
    this.validarFechas(dto.fechaInicio, dto.fechaFin);

    const { imagenes, imagenPrincipal, ...resto } = dto;

    const destino = this.destinoRepository.create({
      ...resto,
      imagenPrincipal: imagenPrincipal ?? imagenes?.[0],
    });
    const guardado = await this.destinoRepository.save(destino);

    if (imagenes && imagenes.length > 0) {
      const principal = imagenPrincipal ?? imagenes[0];
      await this.destinoImagenRepository.save(
        imagenes.map((url) =>
          this.destinoImagenRepository.create({
            destino: { id: guardado.id } as Destino,
            url,
            esPrincipal: url === principal,
          }),
        ),
      );
    }

    await this.invalidarCache();
    return this.findOne(guardado.id);
  }

  /**
   * Listado público: visitantes y clientes ven exactamente lo mismo,
   * solo destinos activos (según el requerimiento del proyecto).
   */
  async findAll(): Promise<Destino[]> {
    return this.cache.wrap(`${CACHE_PREFIX}list:public`, CACHE_TTL_SEGUNDOS, () =>
      this.destinoRepository.find({
        where: { activo: true },
        relations: { categorias: true, imagenes: true },
        order: { nombre: 'ASC' },
      }),
    );
  }

  /** Listado para el panel admin: incluye destinos desactivados. */
  async findAllAdmin(): Promise<Destino[]> {
    return this.destinoRepository.find({
      relations: { categorias: true, imagenes: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Destino> {
    const destino = await this.cache.wrap(
      `${CACHE_PREFIX}detail:${id}`,
      CACHE_TTL_SEGUNDOS,
      () =>
        this.destinoRepository.findOne({
          where: { id },
          relations: { categorias: true, imagenes: true },
        }),
    );

    if (!destino) {
      throw new NotFoundException('Destino no encontrado');
    }

    return destino;
  }

  /**
   * Búsqueda full-text sobre destinos (nombre, descripción, país, ciudad),
   * usando la columna search_vector que ya llena destino_search_trigger
   * en Script-26.sql. plainto_tsquery interpreta el texto libre del
   * usuario como una lista de términos (no hace falta que sepa la
   * sintaxis de tsquery).
   */
  async buscar(q: string): Promise<Destino[]> {
    if (!q || !q.trim()) {
      return this.findAll();
    }

    const clave = `${CACHE_PREFIX}search:${q.trim().toLowerCase()}`;
    return this.cache.wrap(clave, CACHE_TTL_SEGUNDOS, () =>
      this.destinoRepository
        .createQueryBuilder('destino')
        .where('destino.activo = true')
        .andWhere(
          `destino.search_vector @@ plainto_tsquery('spanish', unaccent(:q))`,
          { q },
        )
        .orderBy(
          `ts_rank(destino.search_vector, plainto_tsquery('spanish', unaccent(:q)))`,
          'DESC',
        )
        .getMany(),
    );
  }

  async update(id: number, dto: UpdateDestinoDto): Promise<Destino> {
    const destino = await this.findOne(id);

    const fechaInicio = dto.fechaInicio ?? destino.fechaInicio;
    const fechaFin = dto.fechaFin ?? destino.fechaFin;
    if (fechaInicio && fechaFin) {
      this.validarFechas(fechaInicio, fechaFin);
    }

    Object.assign(destino, dto);
    const guardado = await this.destinoRepository.save(destino);
    await this.invalidarCache();
    return guardado;
  }

  async remove(id: number): Promise<void> {
    const destino = await this.findOne(id);

    try {
      await this.destinoRepository.remove(destino);
    } catch (error) {
      // 23503 = foreign_key_violation (p.ej. hay paquetes que referencian
      // este destino). En vez de un 500 crudo, respondemos algo entendible.
      if (
        error instanceof QueryFailedError &&
        (error as unknown as { code?: string }).code === '23503'
      ) {
        throw new ConflictException(
          'No se puede eliminar: hay paquetes turísticos asociados a este destino. Desactívalo en su lugar.',
        );
      }
      throw error;
    }

    await this.invalidarCache();
  }

  // --- Galería de imágenes ---

  async agregarImagen(destinoId: number, url: string): Promise<DestinoImagen> {
    const destino = await this.findOne(destinoId);

    // Si es la primera imagen que se agrega, queda como principal
    // automáticamente (no tiene sentido una galería sin foto de perfil).
    const esPrimera = !destino.imagenes || destino.imagenes.length === 0;

    const imagen = this.destinoImagenRepository.create({
      destino: { id: destinoId } as Destino,
      url,
      esPrincipal: esPrimera,
    });

    const guardada = await this.destinoImagenRepository.save(imagen);

    if (esPrimera) {
      await this.destinoRepository.update(destinoId, { imagenPrincipal: url });
    }

    await this.invalidarCache();
    return guardada;
  }

  async eliminarImagen(destinoId: number, imagenId: number): Promise<void> {
    const imagen = await this.destinoImagenRepository.findOne({
      where: { id: imagenId, destinoId },
    });

    if (!imagen) {
      throw new NotFoundException(
        'Imagen no encontrada para este destino',
      );
    }

    const eraPrincipal = imagen.esPrincipal;
    await this.destinoImagenRepository.remove(imagen);

    if (eraPrincipal) {
      // Se fue la foto de perfil: promovemos otra imagen restante (si
      // queda alguna) para que la galería nunca quede sin principal.
      const siguiente = await this.destinoImagenRepository.findOne({
        where: { destinoId },
        order: { createdAt: 'ASC' },
      });

      if (siguiente) {
        siguiente.esPrincipal = true;
        await this.destinoImagenRepository.save(siguiente);
      }

      await this.destinoRepository.update(destinoId, {
        imagenPrincipal: siguiente?.url,
      });
    }

    await this.invalidarCache();
  }

  /** Marca una imagen de la galería como la "de perfil" del destino. */
  async marcarPrincipal(
    destinoId: number,
    imagenId: number,
  ): Promise<DestinoImagen> {
    const imagen = await this.destinoImagenRepository.findOne({
      where: { id: imagenId, destinoId },
    });

    if (!imagen) {
      throw new NotFoundException('Imagen no encontrada para este destino');
    }

    await this.destinoImagenRepository.update(
      { destinoId },
      { esPrincipal: false },
    );
    imagen.esPrincipal = true;
    await this.destinoImagenRepository.save(imagen);

    await this.destinoRepository.update(destinoId, {
      imagenPrincipal: imagen.url,
    });

    await this.invalidarCache();
    return imagen;
  }

  // --- Categorías ---

  async agregarCategoria(
    destinoId: number,
    categoriaId: number,
  ): Promise<Destino> {
    const destino = await this.findOne(destinoId);

    const categoria = await this.categoriaRepository.findOne({
      where: { id: categoriaId },
    });

    if (!categoria) {
      throw new BadRequestException('La categoría indicada no existe');
    }

    destino.categorias = destino.categorias ?? [];

    if (!destino.categorias.some((c) => c.id === categoriaId)) {
      destino.categorias.push(categoria);
      await this.destinoRepository.save(destino);
      await this.invalidarCache();
    }

    return destino;
  }

  async quitarCategoria(
    destinoId: number,
    categoriaId: number,
  ): Promise<Destino> {
    const destino = await this.findOne(destinoId);

    destino.categorias = (destino.categorias ?? []).filter(
      (c) => c.id !== categoriaId,
    );

    await this.destinoRepository.save(destino);
    await this.invalidarCache();
    return destino;
  }
}
