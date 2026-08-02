import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Noticia } from './entities/noticia.entity';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { CacheService } from '../redis/cache.service';

const CACHE_PREFIX = 'noticias:';
const CACHE_TTL_SEGUNDOS = 120;

@Injectable()
export class NoticiasService {
  constructor(
    @InjectRepository(Noticia)
    private readonly noticiaRepository: Repository<Noticia>,
    private readonly cache: CacheService,
  ) {}

  private invalidarCache(): Promise<void> {
    return this.cache.delByPrefix(CACHE_PREFIX);
  }

  async create(dto: CreateNoticiaDto, autorId?: number): Promise<Noticia> {
    const noticia = this.noticiaRepository.create({
      ...dto,
      autorId,
    });

    const guardada = await this.noticiaRepository.save(noticia);
    await this.invalidarCache();
    return this.findOne(guardada.id);
  }

  /** Público: solo noticias activas (publicadas), más recientes primero. */
  async findAll(): Promise<Noticia[]> {
    return this.cache.wrap(
      `${CACHE_PREFIX}list:public`,
      CACHE_TTL_SEGUNDOS,
      () =>
        this.noticiaRepository.find({
          where: { activa: true },
          order: { createdAt: 'DESC' },
        }),
    );
  }

  /** Panel admin: todas las noticias, publicadas o en borrador. */
  async findAllAdmin(): Promise<Noticia[]> {
    return this.noticiaRepository.find({
      relations: { autor: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Noticia> {
    const noticia = await this.noticiaRepository.findOne({
      where: { id },
      relations: { autor: true },
    });

    if (!noticia) {
      throw new NotFoundException('Noticia no encontrada');
    }

    return noticia;
  }

  async update(id: number, dto: UpdateNoticiaDto): Promise<Noticia> {
    const noticia = await this.findOne(id);
    Object.assign(noticia, dto);

    const guardada = await this.noticiaRepository.save(noticia);
    await this.invalidarCache();
    return guardada;
  }

  /** Borrado permanente y completo (no hay papelera ni soft-delete). */
  async remove(id: number): Promise<void> {
    const noticia = await this.findOne(id);
    await this.noticiaRepository.remove(noticia);
    await this.invalidarCache();
  }

  async count(): Promise<number> {
    return this.noticiaRepository.count();
  }
}
