import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import {
  TASKS_QUEUE,
  LimpiarAuditoriaJobData,
  LimpiarServiciosDesactivadosJobData,
} from './tasks.queue';

const DIAS_RETENCION_AUDITORIA = 180;

// Paquetes/ofertas desactivados hace más de 6 meses se borran solos.
const MESES_RETENCION_SERVICIOS_DESACTIVADOS = 6;

/**
 * Dispara tareas de mantenimiento periódicas encolándolas en BullMQ, en
 * vez de ejecutar el trabajo pesado directamente dentro del cron. Así:
 * - No bloquea el event loop del proceso web si la tarea es lenta.
 * - Si falla, BullMQ reintenta (el cron no vuelve a correr hasta el
 *   día siguiente).
 */
@Injectable()
export class TasksScheduler {
  private readonly logger = new Logger(TasksScheduler.name);

  constructor(
    @InjectQueue(TASKS_QUEUE)
    private readonly tasksQueue: Queue<
      LimpiarAuditoriaJobData | LimpiarServiciosDesactivadosJobData
    >,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async encolarLimpiezaAuditoria(): Promise<void> {
    this.logger.log('Encolando limpieza de auditoría antigua');
    await this.tasksQueue.add(
      'limpiar-auditoria-antigua',
      { diasRetencion: DIAS_RETENCION_AUDITORIA },
      { attempts: 2, removeOnComplete: { age: 3600 }, removeOnFail: { age: 86_400 } },
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async encolarLimpiezaServiciosDesactivados(): Promise<void> {
    this.logger.log('Encolando limpieza de servicios desactivados hace 6+ meses');
    await this.tasksQueue.add(
      'limpiar-servicios-desactivados',
      { mesesRetencion: MESES_RETENCION_SERVICIOS_DESACTIVADOS },
      { attempts: 2, removeOnComplete: { age: 3600 }, removeOnFail: { age: 86_400 } },
    );
  }
}
