import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SlidesService } from './slides.service';
import { SlidesController } from './slides.controller';
import { HomeSlide } from './entities/home-slide.entity';
import { DestinosModule } from '../destinos/destinos.module';
import { PaquetesModule } from '../paquetes/paquetes.module';
import { OfertasModule } from '../ofertas/ofertas.module';
import { NoticiasModule } from '../noticias/noticias.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HomeSlide]),
    DestinosModule,
    PaquetesModule,
    OfertasModule,
    NoticiasModule,
  ],
  controllers: [SlidesController],
  providers: [SlidesService],
  exports: [SlidesService],
})
export class SlidesModule {}
