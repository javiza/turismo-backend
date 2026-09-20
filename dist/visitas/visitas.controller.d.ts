import type { Request } from 'express';
import { VisitasService } from './visitas.service';
import { CreateVisitaDto } from './dto/create-visita.dto';
export declare class VisitasController {
    private readonly visitasService;
    constructor(visitasService: VisitasService);
    registrar(dto: CreateVisitaDto, req: Request): Promise<void>;
}
