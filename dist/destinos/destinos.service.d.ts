import { Repository } from 'typeorm';
import { Destino } from './entities/destino.entity';
import { DestinoImagen } from './entities/destino-imagen.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { CreateDestinoDto } from './dto/create-destino.dto';
import { UpdateDestinoDto } from './dto/update-destino.dto';
import { CacheService } from '../redis/cache.service';
export declare class DestinosService {
    private readonly destinoRepository;
    private readonly destinoImagenRepository;
    private readonly categoriaRepository;
    private readonly cache;
    constructor(destinoRepository: Repository<Destino>, destinoImagenRepository: Repository<DestinoImagen>, categoriaRepository: Repository<Categoria>, cache: CacheService);
    private invalidarCache;
    private validarFechas;
    create(dto: CreateDestinoDto): Promise<Destino>;
    findAll(): Promise<Destino[]>;
    findAllAdmin(): Promise<Destino[]>;
    findOne(id: number): Promise<Destino>;
    buscar(q: string): Promise<Destino[]>;
    update(id: number, dto: UpdateDestinoDto): Promise<Destino>;
    remove(id: number): Promise<void>;
    agregarImagen(destinoId: number, url: string): Promise<DestinoImagen>;
    eliminarImagen(destinoId: number, imagenId: number): Promise<void>;
    marcarPrincipal(destinoId: number, imagenId: number): Promise<DestinoImagen>;
    agregarCategoria(destinoId: number, categoriaId: number): Promise<Destino>;
    quitarCategoria(destinoId: number, categoriaId: number): Promise<Destino>;
}
