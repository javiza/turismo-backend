import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { WhatsappJobData } from './whatsapp.queue';
import { WhatsappService } from './whatsapp.service';
export declare class WhatsappProcessor extends WorkerHost {
    private readonly whatsappService;
    private readonly logger;
    constructor(whatsappService: WhatsappService);
    process(job: Job<WhatsappJobData>): Promise<void>;
}
