import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MensajesService } from './mensajes.service';
import { MensajesController } from './mensajes.controller';
import { Mensaje } from './entities/mensaje.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Mensaje]), EmailModule],
  controllers: [MensajesController],
  providers: [MensajesService],
  exports: [MensajesService],
})
export class MensajesModule {}
