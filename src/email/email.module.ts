import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { EmailService } from './email.service';
import { EmailProcessor } from './email.processor';
import { EMAIL_QUEUE } from './email.queue';
import { ConfiguracionModule } from '../configuracion/configuracion.module';

@Module({
  imports: [BullModule.registerQueue({ name: EMAIL_QUEUE }), ConfiguracionModule],
  providers: [EmailService, EmailProcessor],
  exports: [EmailService],
})
export class EmailModule {}
