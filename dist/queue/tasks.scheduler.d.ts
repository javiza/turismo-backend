import { Queue } from 'bullmq';
import { LimpiarAuditoriaJobData, LimpiarServiciosDesactivadosJobData } from './tasks.queue';
export declare class TasksScheduler {
    private readonly tasksQueue;
    private readonly logger;
    constructor(tasksQueue: Queue<LimpiarAuditoriaJobData | LimpiarServiciosDesactivadosJobData>);
    encolarLimpiezaAuditoria(): Promise<void>;
    encolarLimpiezaServiciosDesactivados(): Promise<void>;
}
