export const TASKS_QUEUE = 'tasks';

export type TasksJobName =
  | 'limpiar-auditoria-antigua'
  | 'limpiar-servicios-desactivados';

export interface LimpiarAuditoriaJobData {
  diasRetencion: number;
}

// Paquetes y ofertas desactivados hace más de `mesesRetencion` meses se
// borran en forma definitiva (ver PaquetesService/OfertasService
// .limpiar*AntiguoS y TasksScheduler).
export interface LimpiarServiciosDesactivadosJobData {
  mesesRetencion: number;
}
