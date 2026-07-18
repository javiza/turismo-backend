import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VisitasService } from './visitas.service';
import { VisitasController } from './visitas.controller';
import { Visita } from './entities/visita.entity';
import { Destino } from '../destinos/entities/destino.entity';
import { Paquete } from '../paquetes/entities/paquete.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Visita, Destino, Paquete])],
  controllers: [VisitasController],
  providers: [VisitasService],
  exports: [VisitasService],
})
export class VisitasModule {}
