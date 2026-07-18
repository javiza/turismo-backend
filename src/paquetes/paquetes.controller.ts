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
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { PaquetesService } from './paquetes.service';
import { CreatePaqueteDto } from './dto/create-paquete.dto';
import { UpdatePaqueteDto } from './dto/update-paquete.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';

@Controller('paquetes')
export class PaquetesController {
  constructor(private readonly paquetesService: PaquetesService) {}

  // --- Lectura pública: visitantes y clientes ven lo mismo ---

  @Get()
  findAll() {
    return this.paquetesService.findAll();
  }

  @Get('buscar')
  buscar(@Query('q') q: string) {
    return this.paquetesService.buscar(q);
  }

  // NOTA: ruta estática antes que ':id' (ver mismo comentario en
  // destinos.controller.ts) para que no quede tapada por el parámetro.
  @Get('admin/todos')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  findAllAdmin() {
    return this.paquetesService.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paquetesService.findOne(+id);
  }

  // --- Escritura: solo administradores ---

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  create(@Body() dto: CreatePaqueteDto) {
    return this.paquetesService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdatePaqueteDto) {
    return this.paquetesService.update(+id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.paquetesService.remove(+id);
  }
}
