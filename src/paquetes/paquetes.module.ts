import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaquetesService } from './paquetes.service';
import { PaquetesController } from './paquetes.controller';
import { Paquete } from './entities/paquete.entity';
import { PaqueteImagen } from './entities/paquete-imagen.entity';
import { DestinoImagen } from '../destinos/entities/destino-imagen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paquete, PaqueteImagen, DestinoImagen])],
  controllers: [PaquetesController],
  providers: [PaquetesService],
  exports: [PaquetesService],
})
export class PaquetesModule {}
