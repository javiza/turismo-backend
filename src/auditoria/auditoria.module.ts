import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditoriaService } from './auditoria.service';
import { AuditoriaController } from './auditoria.controller';
import { Auditoria } from './entities/auditoria.entity';
import { AuditoriaSubscriber } from './subscribers/auditoria.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Auditoria])],
  controllers: [AuditoriaController],
  providers: [AuditoriaService, AuditoriaSubscriber],
  exports: [AuditoriaService],
})
export class AuditoriaModule {}
