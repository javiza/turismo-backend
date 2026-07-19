import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FinanzasService } from './finanzas.service';
import { FinanzasController } from './finanzas.controller';
import { Reserva } from '../reservas/entities/reserva.entity';
import { MovimientoFinanciero } from './entities/movimiento-financiero.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, MovimientoFinanciero])],
  controllers: [FinanzasController],
  providers: [FinanzasService],
})
export class FinanzasModule {}
