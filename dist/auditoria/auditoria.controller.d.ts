import { AuditoriaService } from './auditoria.service';
export declare class AuditoriaController {
    private readonly auditoriaService;
    constructor(auditoriaService: AuditoriaService);
    findAll(tabla?: string): Promise<import("./entities/auditoria.entity").Auditoria[]>;
}
