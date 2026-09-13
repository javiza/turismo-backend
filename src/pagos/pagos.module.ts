import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { PagoWebpay } from './entities/pago-webpay.entity';
import { Reserva } from '../reservas/entities/reserva.entity';
import { ConfiguracionModule } from '../configuracion/configuracion.module';

@Module({
  imports: [TypeOrmModule.forFeature([PagoWebpay, Reserva]), ConfiguracionModule],
  controllers: [PagosController],
  providers: [PagosService],
  exports: [PagosService],
})
export class PagosModule {}
