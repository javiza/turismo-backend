export declare const TASKS_QUEUE = "tasks";
export type TasksJobName = 'limpiar-auditoria-antigua' | 'limpiar-servicios-desactivados';
export interface LimpiarAuditoriaJobData {
    diasRetencion: number;
}
export interface LimpiarServiciosDesactivadosJobData {
    mesesRetencion: number;
}
