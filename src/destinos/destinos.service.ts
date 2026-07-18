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

@Injectable()
export class DestinosService {
  constructor(
    @InjectRepository(Destino)
    private readonly destinoRepository: Repository<Destino>,
    @InjectRepository(DestinoImagen)
    private readonly destinoImagenRepository: Repository<DestinoImagen>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async create(dto: CreateDestinoDto): Promise<Destino> {
    const destino = this.destinoRepository.create(dto);
    return this.destinoRepository.save(destino);
  }

  /**
   * Listado público: visitantes y clientes ven exactamente lo mismo,
   * solo destinos activos (según el requerimiento del proyecto).
   */
  async findAll(): Promise<Destino[]> {
    return this.destinoRepository.find({
      where: { activo: true },
      relations: { categorias: true, imagenes: true },
      order: { nombre: 'ASC' },
    });
  }

  /** Listado para el panel admin: incluye destinos desactivados. */
  async findAllAdmin(): Promise<Destino[]> {
    return this.destinoRepository.find({
      relations: { categorias: true, imagenes: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Destino> {
    const destino = await this.destinoRepository.findOne({
      where: { id },
      relations: { categorias: true, imagenes: true },
    });

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

    return this.destinoRepository
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
      .getMany();
  }

  async update(id: number, dto: UpdateDestinoDto): Promise<Destino> {
    const destino = await this.findOne(id);
    Object.assign(destino, dto);
    return this.destinoRepository.save(destino);
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
  }

  // --- Galería de imágenes ---

  async agregarImagen(destinoId: number, url: string): Promise<DestinoImagen> {
    await this.findOne(destinoId);

    const imagen = this.destinoImagenRepository.create({
      destino: { id: destinoId } as Destino,
      url,
    });

    return this.destinoImagenRepository.save(imagen);
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

    await this.destinoImagenRepository.remove(imagen);
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
    return destino;
  }
}
