import { Repository } from 'typeorm';
import { Paquete } from './entities/paquete.entity';
import { PaqueteImagen } from './entities/paquete-imagen.entity';
import { DestinoImagen } from '../destinos/entities/destino-imagen.entity';
import { CreatePaqueteDto } from './dto/create-paquete.dto';
import { UpdatePaqueteDto } from './dto/update-paquete.dto';
import { CacheService } from '../redis/cache.service';
export declare class PaquetesService {
    private readonly paqueteRepository;
    private readonly paqueteImagenRepository;
    private readonly destinoImagenRepository;
    private readonly cache;
    constructor(paqueteRepository: Repository<Paquete>, paqueteImagenRepository: Repository<PaqueteImagen>, destinoImagenRepository: Repository<DestinoImagen>, cache: CacheService);
    private invalidarCache;
    private validarFechas;
    create(dto: CreatePaqueteDto): Promise<Paquete>;
    private heredarImagenesDeDestino;
    findAll(): Promise<Paquete[]>;
    findAllAdmin(): Promise<Paquete[]>;
    buscar(q: string): Promise<Paquete[]>;
    findOne(id: number): Promise<Paquete>;
    update(id: number, dto: UpdatePaqueteDto): Promise<Paquete>;
    remove(id: number): Promise<void>;
    private isForeignKeyViolation;
    limpiarDesactivadosAntiguos(mesesRetencion: number): Promise<number>;
    agregarImagen(paqueteId: number, url: string): Promise<PaqueteImagen>;
    eliminarImagen(paqueteId: number, imagenId: number): Promise<void>;
    marcarPrincipal(paqueteId: number, imagenId: number): Promise<PaqueteImagen>;
}
