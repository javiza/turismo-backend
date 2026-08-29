import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { CacheService } from '../redis/cache.service';
export declare class CategoriasService {
    private readonly categoriaRepository;
    private readonly cache;
    constructor(categoriaRepository: Repository<Categoria>, cache: CacheService);
    create(dto: CreateCategoriaDto): Promise<Categoria>;
    findAll(): Promise<Categoria[]>;
    findOne(id: number): Promise<Categoria>;
    update(id: number, dto: UpdateCategoriaDto): Promise<Categoria>;
    remove(id: number): Promise<void>;
    private isUniqueViolation;
}
