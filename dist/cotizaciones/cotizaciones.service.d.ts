import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cotizacion } from './entities/cotizacion.entity';
import { Paquete } from '../paquetes/entities/paquete.entity';
import { Destino } from '../destinos/entities/destino.entity';
import { Noticia } from '../noticias/entities/noticia.entity';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { UpdateCotizacionDto } from './dto/update-cotizacion.dto';
import { AdminCotizacionDto } from './dto/admin-cotizacion.dto';
export declare class CotizacionesService {
    private readonly cotizacionRepository;
    private readonly paqueteRepository;
    private readonly destinoRepository;
    private readonly noticiaRepository;
    private readonly eventEmitter;
    constructor(cotizacionRepository: Repository<Cotizacion>, paqueteRepository: Repository<Paquete>, destinoRepository: Repository<Destino>, noticiaRepository: Repository<Noticia>, eventEmitter: EventEmitter2);
    create(dto: CreateCotizacionDto, clienteId?: number): Promise<Cotizacion>;
    findAll(): Promise<Cotizacion[]>;
    contarNoLeidas(): Promise<{
        count: number;
    }>;
    findByCliente(clienteId: number): Promise<Cotizacion[]>;
    findOne(id: number): Promise<Cotizacion>;
    updateEstado(id: number, dto: UpdateCotizacionDto): Promise<Cotizacion>;
    updateAdmin(id: number, dto: AdminCotizacionDto): Promise<Cotizacion>;
    remove(id: number): Promise<void>;
}
