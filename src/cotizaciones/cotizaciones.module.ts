import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CotizacionesService } from './cotizaciones.service';
import { CotizacionesController } from './cotizaciones.controller';
import { Cotizacion } from './entities/cotizacion.entity';
import { Paquete } from '../paquetes/entities/paquete.entity';
import { Destino } from '../destinos/entities/destino.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cotizacion, Paquete, Destino]), EmailModule],
  controllers: [CotizacionesController],
  providers: [CotizacionesService],
  exports: [CotizacionesService],
})
export class CotizacionesModule {}
