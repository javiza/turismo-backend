import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { WHATSAPP_QUEUE, WhatsappJobData } from './whatsapp.queue';
import { WhatsappService } from './whatsapp.service';

@Processor(WHATSAPP_QUEUE)
export class WhatsappProcessor extends WorkerHost {
  private readonly logger = new Logger(WhatsappProcessor.name);

  constructor(private readonly whatsappService: WhatsappService) {
    super();
  }

  async process(job: Job<WhatsappJobData>): Promise<void> {
    const { to, texto } = job.data;

    try {
      await this.whatsappService.enviarTextoImmediate(to, texto);
    } catch (error) {
      this.logger.error(
        `Intento ${job.attemptsMade + 1} fallido enviando WhatsApp a ${to}: ${(error as Error).message}`,
      );
      throw error;
    }
  }
}
