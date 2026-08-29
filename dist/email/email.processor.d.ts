import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailJobData } from './email.queue';
import { EmailService } from './email.service';
export declare class EmailProcessor extends WorkerHost {
    private readonly emailService;
    private readonly logger;
    constructor(emailService: EmailService);
    process(job: Job<EmailJobData>): Promise<void>;
}
