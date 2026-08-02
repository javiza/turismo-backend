import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { SlidesService } from './slides.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { ReordenarSlidesDto } from './dto/reordenar-slides.dto';
import { TipoSlide } from './entities/home-slide.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';

@Controller('slides')
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  // --- Lectura pública: la usa el slide de inicio del cliente ---
  @Get('publico')
  publico() {
    return this.slidesService.publico();
  }

  // --- Panel admin ---

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  findAllAdmin() {
    return this.slidesService.findAllAdmin();
  }

  // Ítems disponibles de un tipo (destino/paquete/oferta/noticia) para
  // elegir en el formulario "Agregar al slide". Ruta estática antes de
  // ':id' para que no choque con esa ruta.
  @Get('opciones')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  opciones(@Query('tipo') tipo: TipoSlide) {
    return this.slidesService.opciones(tipo);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  create(@Body() dto: CreateSlideDto) {
    return this.slidesService.create(dto);
  }

  @Patch('reordenar')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  reordenar(@Body() dto: ReordenarSlidesDto) {
    return this.slidesService.reordenar(dto);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSlideDto) {
    return this.slidesService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.slidesService.remove(id);
  }
}
