import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';

import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async create(dto: CreateCategoriaDto): Promise<Categoria> {
    const categoria = this.categoriaRepository.create(dto);

    try {
      return await this.categoriaRepository.save(categoria);
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException('Ya existe una categoría con ese nombre');
      }
      throw error;
    }
  }

  /** Lectura pública: se usa para poblar filtros de búsqueda en el sitio. */
  async findAll(): Promise<Categoria[]> {
    return this.categoriaRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
    });

    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return categoria;
  }

  async update(id: number, dto: UpdateCategoriaDto): Promise<Categoria> {
    const categoria = await this.findOne(id);
    Object.assign(categoria, dto);

    try {
      return await this.categoriaRepository.save(categoria);
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException('Ya existe una categoría con ese nombre');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const categoria = await this.findOne(id);
    await this.categoriaRepository.remove(categoria);
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      error instanceof QueryFailedError &&
      (error as unknown as { code?: string }).code === '23505'
    );
  }
}
