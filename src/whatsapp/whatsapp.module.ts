import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { WhatsappService } from './whatsapp.service';
import { WhatsappProcessor } from './whatsapp.processor';
import { WHATSAPP_QUEUE } from './whatsapp.queue';
import { ConfiguracionModule } from '../configuracion/configuracion.module';

@Module({
  imports: [BullModule.registerQueue({ name: WHATSAPP_QUEUE }), ConfiguracionModule],
  providers: [WhatsappService, WhatsappProcessor],
  exports: [WhatsappService],
})
export class WhatsappModule {}
