import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { PaquetesService } from '../paquetes/paquetes.service';
import { OfertasService } from '../ofertas/ofertas.service';
export declare class TasksProcessor extends WorkerHost {
    private readonly auditoriaService;
    private readonly paquetesService;
    private readonly ofertasService;
    private readonly logger;
    constructor(auditoriaService: AuditoriaService, paquetesService: PaquetesService, ofertasService: OfertasService);
    process(job: Job): Promise<void>;
    private limpiarAuditoriaAntigua;
    private limpiarServiciosDesactivados;
}
