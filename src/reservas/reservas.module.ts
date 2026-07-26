import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { Reserva } from './entities/reserva.entity';
import { Paquete } from '../paquetes/entities/paquete.entity';
import { Oferta } from '../ofertas/entities/oferta.entity';
import { EmailModule } from '../email/email.module';
import { ReservaNotificacionesListener } from './listeners/reserva-notificaciones.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Paquete, Oferta]), EmailModule],
  controllers: [ReservasController],
  providers: [ReservasService, ReservaNotificacionesListener],
  exports: [ReservasService],
})
export class ReservasModule {}
