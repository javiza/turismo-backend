import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

import { Oferta } from './entities/oferta.entity';
import { Paquete } from '../paquetes/entities/paquete.entity';
import { CreateOfertaDto } from './dto/create-oferta.dto';
import { UpdateOfertaDto } from './dto/update-oferta.dto';

@Injectable()
export class OfertasService {
  constructor(
    @InjectRepository(Oferta)
    private readonly ofertaRepository: Repository<Oferta>,
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
    });

    try {
      return await this.ofertaRepository.save(oferta);
    } catch (error) {
      if (this.isForeignKeyViolation(error)) {
        throw new BadRequestException('El paquete indicado no existe');
      }
      throw error;
    }
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
      relations: { paquete: true },
      order: { fechaInicio: 'ASC' },
    });
  }

  /** Panel admin: todas las ofertas, vigentes o no. */
  async findAllAdmin(): Promise<Oferta[]> {
    return this.ofertaRepository.find({
      relations: { paquete: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Oferta> {
    const oferta = await this.ofertaRepository.findOne({
      where: { id },
      relations: { paquete: true },
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
}
