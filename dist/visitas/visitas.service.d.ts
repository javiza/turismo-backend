import { Repository } from 'typeorm';
import { Visita } from './entities/visita.entity';
import { CreateVisitaDto } from './dto/create-visita.dto';
export declare class VisitasService {
    private readonly visitaRepository;
    constructor(visitaRepository: Repository<Visita>);
    registrar(dto: CreateVisitaDto, meta: {
        ip?: string;
        userAgent?: string;
    }): Promise<void>;
}
