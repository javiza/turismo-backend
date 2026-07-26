import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { EMAIL_QUEUE, EmailJobData } from './email.queue';
import { EmailService } from './email.service';

/**
 * Worker de la cola 'email'. Si sendImmediate lanza (SMTP caído, timeout,
 * credenciales rechazadas, etc.) BullMQ reintenta automáticamente según la
 * política definida al encolar (ver EmailService.send): 3 intentos con
 * backoff exponencial. Si los 3 fallan, el job queda marcado como failed
 * y se loguea — igual que antes, un correo fallido nunca revierte una
 * reserva/cotización ya guardada.
 */
@Processor(EMAIL_QUEUE)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<EmailJobData>): Promise<void> {
    const { to, subject, html } = job.data;

    try {
      await this.emailService.sendImmediate(to, subject, html);
    } catch (error) {
      this.logger.error(
        `Intento ${job.attemptsMade + 1} fallido enviando correo a ${to}: ${(error as Error).message}`,
      );
      throw error; // deja que BullMQ decida el reintento
    }
  }
}
