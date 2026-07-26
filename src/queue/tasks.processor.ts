import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import {
  TASKS_QUEUE,
  LimpiarAuditoriaJobData,
  LimpiarServiciosDesactivadosJobData,
} from './tasks.queue';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { PaquetesService } from '../paquetes/paquetes.service';
import { OfertasService } from '../ofertas/ofertas.service';

/**
 * Worker genérico de tareas en segundo plano que no son ni email ni
 * WhatsApp (esas tienen su propia cola). Por ahora solo trae un job de
 * ejemplo (limpieza de auditoría vieja) que demuestra el patrón: un cron
 * de @nestjs/schedule (ver TasksScheduler) encola el job en vez de
 * ejecutar el trabajo pesado directamente en el proceso del cron, así
 * queda con reintentos y no bloquea si el proceso web está ocupado.
 *
 * Para agregar una tarea nueva: 1) un nombre de job en tasks.queue.ts,
 * 2) un case acá, 3) quien la dispare (cron, evento, endpoint admin) hace
 * `queue.add(nombre, data)`.
 */
@Processor(TASKS_QUEUE)
export class TasksProcessor extends WorkerHost {
  private readonly logger = new Logger(TasksProcessor.name);

  constructor(
    private readonly auditoriaService: AuditoriaService,
    private readonly paquetesService: PaquetesService,
    private readonly ofertasService: OfertasService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case 'limpiar-auditoria-antigua':
        return this.limpiarAuditoriaAntigua(job.data as LimpiarAuditoriaJobData);
      case 'limpiar-servicios-desactivados':
        return this.limpiarServiciosDesactivados(
          job.data as LimpiarServiciosDesactivadosJobData,
        );
      default:
        this.logger.warn(`Job desconocido en cola 'tasks': ${job.name}`);
    }
  }

  private async limpiarAuditoriaAntigua(data: LimpiarAuditoriaJobData): Promise<void> {
    const borrados = await this.auditoriaService.limpiarAntiguos(data.diasRetencion);
    this.logger.log(
      `Limpieza de auditoría: ${borrados} registro(s) mayores a ${data.diasRetencion} días eliminados`,
    );
  }

  private async limpiarServiciosDesactivados(
    data: LimpiarServiciosDesactivadosJobData,
  ): Promise<void> {
    const [paquetesBorrados, ofertasBorradas] = await Promise.all([
      this.paquetesService.limpiarDesactivadosAntiguos(data.mesesRetencion),
      this.ofertasService.limpiarDesactivadasAntiguas(data.mesesRetencion),
    ]);
    this.logger.log(
      `Limpieza de servicios desactivados (${data.mesesRetencion}+ meses): ` +
        `${paquetesBorrados} paquete(s) y ${ofertasBorradas} oferta(s) eliminados definitivamente`,
    );
  }
}
