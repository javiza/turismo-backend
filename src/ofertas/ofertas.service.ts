import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  QueryFailedError,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';

import { Oferta } from './entities/oferta.entity';
import { OfertaImagen } from './entities/oferta-imagen.entity';
import { Paquete } from '../paquetes/entities/paquete.entity';
import { PaqueteImagen } from '../paquetes/entities/paquete-imagen.entity';
import { DestinoImagen } from '../destinos/entities/destino-imagen.entity';
import { CreateOfertaDto } from './dto/create-oferta.dto';
import { UpdateOfertaDto } from './dto/update-oferta.dto';

@Injectable()
export class OfertasService {
  constructor(
    @InjectRepository(Oferta)
    private readonly ofertaRepository: Repository<Oferta>,
    @InjectRepository(Paquete)
    private readonly paqueteRepository: Repository<Paquete>,
    @InjectRepository(PaqueteImagen)
    private readonly paqueteImagenRepository: Repository<PaqueteImagen>,
    @InjectRepository(DestinoImagen)
    private readonly destinoImagenRepository: Repository<DestinoImagen>,
    @InjectRepository(OfertaImagen)
    private readonly ofertaImagenRepository: Repository<OfertaImagen>,
  ) {}

  private validarFechas(fechaInicio: string, fechaFin: string) {
    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      throw new BadRequestException(
        'La fecha de fin debe ser posterior a la fecha de inicio',
      );
    }
  }

  async create(dto: CreateOfertaDto): Promise<Oferta> {
    this.validarFechas(dto.fechaInicio, dto.fechaFin);

    const oferta = this.ofertaRepository.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      descuento: dto.descuento,
      fechaInicio: dto.fechaInicio,
      fechaFin: dto.fechaFin,
      paquete: { id: dto.paqueteId } as Paquete,
      imagenPrincipal: dto.imagenPrincipal ?? dto.imagenes?.[0],
    });

    let guardada: Oferta;
    try {
      guardada = await this.ofertaRepository.save(oferta);
    } catch (error) {
      if (this.isForeignKeyViolation(error)) {
        throw new BadRequestException('El paquete indicado no existe');
      }
      throw error;
    }

    if (dto.imagenes && dto.imagenes.length > 0) {
      const principal = dto.imagenPrincipal ?? dto.imagenes[0];
      await this.ofertaImagenRepository.save(
        dto.imagenes.map((url) =>
          this.ofertaImagenRepository.create({
            oferta: { id: guardada.id } as Oferta,
            url,
            esPrincipal: url === principal,
          }),
        ),
      );
    } else {
      // Sin imágenes propias: hereda del paquete asociado y, si ese
      // paquete tampoco tiene, cae en cascada a las del destino del
      // paquete. Así una oferta nunca queda sin imagen en cards/listados.
      await this.heredarImagenes(guardada.id, dto.paqueteId);
    }

    return this.findOne(guardada.id);
  }

  /**
   * Copia hacia oferta_imagenes la galería del paquete "coincidente"
   * (mismo paqueteId) y, si ese paquete no tiene ninguna imagen propia
   * todavía, la del destino al que pertenece ese paquete.
   */
  private async heredarImagenes(
    ofertaId: number,
    paqueteId: number,
  ): Promise<void> {
    let fuente = await this.paqueteImagenRepository.find({
      where: { paqueteId },
      order: { createdAt: 'ASC' },
    });

    if (fuente.length === 0) {
      const paquete = await this.paqueteRepository.findOne({
        where: { id: paqueteId },
      });

      if (paquete) {
        const imagenesDestino = await this.destinoImagenRepository.find({
          where: { destinoId: paquete.destinoId },
          order: { createdAt: 'ASC' },
        });
        fuente = imagenesDestino.map((img) => ({
          url: img.url,
          esPrincipal: img.esPrincipal,
        })) as typeof fuente;
      }
    }

    if (!fuente || fuente.length === 0) {
      return;
    }

    await this.ofertaImagenRepository.save(
      fuente.map((img) =>
        this.ofertaImagenRepository.create({
          oferta: { id: ofertaId } as Oferta,
          url: img.url,
          esPrincipal: img.esPrincipal,
        }),
      ),
    );

    const principal = fuente.find((i) => i.esPrincipal) ?? fuente[0];
    await this.ofertaRepository.update(ofertaId, {
      imagenPrincipal: principal.url,
    });
  }

  /** Público: solo ofertas activas y vigentes hoy. */
  async findAll(): Promise<Oferta[]> {
    const hoy = new Date().toISOString().slice(0, 10);

    return this.ofertaRepository.find({
      where: {
        activa: true,
        fechaInicio: LessThanOrEqual(hoy),
        fechaFin: MoreThanOrEqual(hoy),
      },
      relations: { paquete: true, imagenes: true },
      order: { fechaInicio: 'ASC' },
    });
  }

  /** Panel admin: todas las ofertas, vigentes o no. */
  async findAllAdmin(): Promise<Oferta[]> {
    return this.ofertaRepository.find({
      relations: { paquete: true, imagenes: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Oferta> {
    const oferta = await this.ofertaRepository.findOne({
      where: { id },
      relations: { paquete: true, imagenes: true },
    });

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada');
    }

    return oferta;
  }

  async update(id: number, dto: UpdateOfertaDto): Promise<Oferta> {
    const oferta = await this.findOne(id);

    const fechaInicio = dto.fechaInicio ?? oferta.fechaInicio;
    const fechaFin = dto.fechaFin ?? oferta.fechaFin;
    this.validarFechas(fechaInicio, fechaFin);

    const { paqueteId, ...resto } = dto;
    Object.assign(oferta, resto);

    if (paqueteId) {
      oferta.paquete = { id: paqueteId } as Paquete;
    }

    try {
      return await this.ofertaRepository.save(oferta);
    } catch (error) {
      if (this.isForeignKeyViolation(error)) {
        throw new BadRequestException('El paquete indicado no existe');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const oferta = await this.findOne(id);
    await this.ofertaRepository.remove(oferta);
  }

  private isForeignKeyViolation(error: unknown): boolean {
    return (
      error instanceof QueryFailedError &&
      (error as unknown as { code?: string }).code === '23503'
    );
  }

  // --- Galería de imágenes ---

  async agregarImagen(ofertaId: number, url: string): Promise<OfertaImagen> {
    const oferta = await this.findOne(ofertaId);

    const esPrimera = !oferta.imagenes || oferta.imagenes.length === 0;

    const imagen = this.ofertaImagenRepository.create({
      oferta: { id: ofertaId } as Oferta,
      url,
      esPrincipal: esPrimera,
    });

    const guardada = await this.ofertaImagenRepository.save(imagen);

    if (esPrimera) {
      await this.ofertaRepository.update(ofertaId, { imagenPrincipal: url });
    }

    return guardada;
  }

  async eliminarImagen(ofertaId: number, imagenId: number): Promise<void> {
    const imagen = await this.ofertaImagenRepository.findOne({
      where: { id: imagenId, ofertaId },
    });

    if (!imagen) {
      throw new NotFoundException('Imagen no encontrada para esta oferta');
    }

    const eraPrincipal = imagen.esPrincipal;
    await this.ofertaImagenRepository.remove(imagen);

    if (eraPrincipal) {
      const siguiente = await this.ofertaImagenRepository.findOne({
        where: { ofertaId },
        order: { createdAt: 'ASC' },
      });

      if (siguiente) {
        siguiente.esPrincipal = true;
        await this.ofertaImagenRepository.save(siguiente);
      }

      await this.ofertaRepository.update(ofertaId, {
        imagenPrincipal: siguiente?.url,
      });
    }
  }

  /** Marca una imagen de la galería como la "de perfil" de la oferta. */
  async marcarPrincipal(
    ofertaId: number,
    imagenId: number,
  ): Promise<OfertaImagen> {
    const imagen = await this.ofertaImagenRepository.findOne({
      where: { id: imagenId, ofertaId },
    });

    if (!imagen) {
      throw new NotFoundException('Imagen no encontrada para esta oferta');
    }

    await this.ofertaImagenRepository.update(
      { ofertaId },
      { esPrincipal: false },
    );
    imagen.esPrincipal = true;
    await this.ofertaImagenRepository.save(imagen);

    await this.ofertaRepository.update(ofertaId, {
      imagenPrincipal: imagen.url,
    });

    return imagen;
  }
}
