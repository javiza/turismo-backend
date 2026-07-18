import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContenidoService } from './contenido.service';
import { ContenidoController } from './contenido.controller';
import { ContenidoHome } from './entities/contenido-home.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContenidoHome])],
  controllers: [ContenidoController],
  providers: [ContenidoService],
  exports: [ContenidoService],
})
export class ContenidoModule {}
