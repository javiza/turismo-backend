import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { NoticiasService } from './noticias.service';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('noticias')
export class NoticiasController {
  constructor(private readonly noticiasService: NoticiasService) {}

  // --- Lectura pública: solo noticias publicadas ---
  @Get()
  findAll() {
    return this.noticiasService.findAll();
  }

  // NOTA: ruta estática antes que ':id' (mismo patrón que destinos/paquetes/ofertas).
  @Get('admin/todas')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  findAllAdmin() {
    return this.noticiasService.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noticiasService.findOne(+id);
  }

  // --- Escritura: solo administradores ---
  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  create(@Body() dto: CreateNoticiaDto, @CurrentUser() user: JwtPayload) {
    return this.noticiasService.create(dto, user.sub);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateNoticiaDto) {
    return this.noticiasService.update(+id, dto);
  }

  // Borrado definitivo (no hay papelera): el admin lo pidió explícitamente así.
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.noticiasService.remove(+id);
  }
}
