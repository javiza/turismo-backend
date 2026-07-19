import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OfertasService } from './ofertas.service';
import { OfertasController } from './ofertas.controller';
import { Oferta } from './entities/oferta.entity';
import { OfertaImagen } from './entities/oferta-imagen.entity';
import { Paquete } from '../paquetes/entities/paquete.entity';
import { PaqueteImagen } from '../paquetes/entities/paquete-imagen.entity';
import { DestinoImagen } from '../destinos/entities/destino-imagen.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Oferta,
      OfertaImagen,
      Paquete,
      PaqueteImagen,
      DestinoImagen,
    ]),
  ],
  controllers: [OfertasController],
  providers: [OfertasService],
  exports: [OfertasService],
})
export class OfertasModule {}
