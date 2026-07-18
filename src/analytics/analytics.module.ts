import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsEvento } from './entities/analytics-evento.entity';
import { Destino } from '../destinos/entities/destino.entity';
import { Paquete } from '../paquetes/entities/paquete.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyticsEvento, Destino, Paquete])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
