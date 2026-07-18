import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';

import { Paquete } from './entities/paquete.entity';
import { Destino } from '../destinos/entities/destino.entity';
import { CreatePaqueteDto } from './dto/create-paquete.dto';
import { UpdatePaqueteDto } from './dto/update-paquete.dto';

@Injectable()
export class PaquetesService {
  constructor(
    @InjectRepository(Paquete)
    private readonly paqueteRepository: Repository<Paquete>,
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
    });

    try {
      return await this.paqueteRepository.save(paquete);
    } catch (error) {
      if (this.isForeignKeyViolation(error)) {
        throw new BadRequestException('El destino indicado no existe');
      }
      throw error;
    }
  }

  /**
   * Listado público: visitantes y clientes ven exactamente lo mismo,
   * solo paquetes activos.
   */
  async findAll(): Promise<Paquete[]> {
    return this.paqueteRepository.find({
      where: { activo: true },
      relations: { destino: true },
      order: { fechaInicio: 'ASC' },
    });
  }

  /** Listado para el panel admin: incluye paquetes desactivados. */
  async findAllAdmin(): Promise<Paquete[]> {
    return this.paqueteRepository.find({
      relations: { destino: true },
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
      relations: { destino: true },
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

    const { destinoId, ...resto } = dto;
    Object.assign(paquete, resto);

    if (destinoId) {
      paquete.destino = { id: destinoId } as Destino;
    }

    try {
      return await this.paqueteRepository.save(paquete);
    } catch (error) {
      if (this.isForeignKeyViolation(error)) {
        throw new BadRequestException('El destino indicado no existe');
      }
      throw error;
    }
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
}
