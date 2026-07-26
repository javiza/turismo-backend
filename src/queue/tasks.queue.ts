export const TASKS_QUEUE = 'tasks';

export type TasksJobName = 'limpiar-auditoria-antigua';

export interface LimpiarAuditoriaJobData {
  diasRetencion: number;
}
