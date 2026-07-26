import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FinanzasService } from './finanzas.service';
import { FinanzasController } from './finanzas.controller';
import { Reserva } from '../reservas/entities/reserva.entity';
import { MovimientoFinanciero } from './entities/movimiento-financiero.entity';
import { ConfiguracionFinanciera } from './entities/configuracion-financiera.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reserva,
      MovimientoFinanciero,
      ConfiguracionFinanciera,
    ]),
  ],
  controllers: [FinanzasController],
  providers: [FinanzasService],
})
export class FinanzasModule {}
