import { Repository } from 'typeorm';
import { Auditoria, AccionAuditoria } from './entities/auditoria.entity';
export declare class AuditoriaService {
    private readonly auditoriaRepository;
    constructor(auditoriaRepository: Repository<Auditoria>);
    registrar(params: {
        tabla: string;
        accion: AccionAuditoria;
        registroId?: number;
        usuarioId?: number;
        datosAnteriores?: Record<string, unknown>;
        datosNuevos?: Record<string, unknown>;
    }): Promise<void>;
    findAll(tabla?: string): Promise<Auditoria[]>;
    limpiarAntiguos(diasRetencion: number): Promise<number>;
}
