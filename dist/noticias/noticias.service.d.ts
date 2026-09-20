import { Repository } from 'typeorm';
import { Noticia } from './entities/noticia.entity';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { CacheService } from '../redis/cache.service';
export declare class NoticiasService {
    private readonly noticiaRepository;
    private readonly cache;
    constructor(noticiaRepository: Repository<Noticia>, cache: CacheService);
    private invalidarCache;
    create(dto: CreateNoticiaDto, autorId?: number): Promise<Noticia>;
    findAll(): Promise<Noticia[]>;
    findAllAdmin(): Promise<Noticia[]>;
    findOne(id: number): Promise<Noticia>;
    update(id: number, dto: UpdateNoticiaDto): Promise<Noticia>;
    remove(id: number): Promise<void>;
    count(): Promise<number>;
}
