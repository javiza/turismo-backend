import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ContenidoService } from './contenido.service';
import { UpdateContenidoHomeDto } from './dto/update-contenido-home.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';

@Controller('contenido-home')
export class ContenidoController {
  constructor(private readonly contenidoService: ContenidoService) {}

  // --- Lectura pública: la usa la home del sitio ---
  @Get()
  obtener() {
    return this.contenidoService.obtener();
  }

  // --- Escritura: solo administradores ---
  @Patch()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  actualizar(@Body() dto: UpdateContenidoHomeDto) {
    return this.contenidoService.actualizar(dto);
  }
}
