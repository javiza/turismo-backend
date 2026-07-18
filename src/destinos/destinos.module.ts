import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DestinosService } from './destinos.service';
import { DestinosController } from './destinos.controller';
import { Destino } from './entities/destino.entity';
import { DestinoImagen } from './entities/destino-imagen.entity';
import { Categoria } from '../categorias/entities/categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Destino, DestinoImagen, Categoria])],
  controllers: [DestinosController],
  providers: [DestinosService],
  exports: [DestinosService],
})
export class DestinosModule {}
