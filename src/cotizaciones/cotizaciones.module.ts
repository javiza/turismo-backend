import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CotizacionesService } from './cotizaciones.service';
import { CotizacionesController } from './cotizaciones.controller';
import { Cotizacion } from './entities/cotizacion.entity';
import { Paquete } from '../paquetes/entities/paquete.entity';
import { Destino } from '../destinos/entities/destino.entity';
import { Noticia } from '../noticias/entities/noticia.entity';
import { EmailModule } from '../email/email.module';
import { CotizacionNotificacionesListener } from './listeners/cotizacion-notificaciones.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cotizacion, Paquete, Destino, Noticia]),
    EmailModule,
  ],
  controllers: [CotizacionesController],
  providers: [CotizacionesService, CotizacionNotificacionesListener],
  exports: [CotizacionesService],
})
export class CotizacionesModule {}
