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

import { OfertasService } from './ofertas.service';
import { CreateOfertaDto } from './dto/create-oferta.dto';
import { UpdateOfertaDto } from './dto/update-oferta.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';

@Controller('ofertas')
export class OfertasController {
  constructor(private readonly ofertasService: OfertasService) {}

  @Get()
  findAll() {
    return this.ofertasService.findAll();
  }

  // NOTA: ruta estática antes que ':id' (mismo bug que en destinos y
  // paquetes: si ':id' se registra primero, Express nunca llega aquí).
  @Get('admin/todas')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  findAllAdmin() {
    return this.ofertasService.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ofertasService.findOne(+id);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  create(@Body() dto: CreateOfertaDto) {
    return this.ofertasService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateOfertaDto) {
    return this.ofertasService.update(+id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.ofertasService.remove(+id);
  }
}
