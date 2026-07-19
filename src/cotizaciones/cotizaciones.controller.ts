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

import { CotizacionesService } from './cotizaciones.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { UpdateCotizacionDto } from './dto/update-cotizacion.dto';
import { AdminCotizacionDto } from './dto/admin-cotizacion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';
import { OptionalJwtClienteAuthGuard } from '../clientes-auth/guards/optional-jwt-cliente-auth.guard';
import { CurrentCliente } from '../common/decorators/current-cliente.decorator';
import type { JwtClientePayload } from '../clientes-auth/interfaces/jwt-cliente-payload.interface';

@Controller('cotizaciones')
export class CotizacionesController {
  constructor(private readonly cotizacionesService: CotizacionesService) {}

  // --- Público: cualquier visitante puede pedir una cotización. Si tiene
  // sesión de cliente iniciada, queda vinculada a su cuenta (ver nota en
  // ReservasController sobre OptionalJwtClienteAuthGuard). ---
  @Post()
  @UseGuards(OptionalJwtClienteAuthGuard)
  create(
    @Body() dto: CreateCotizacionDto,
    @CurrentCliente() cliente?: JwtClientePayload,
  ) {
    return this.cotizacionesService.create(dto, cliente?.sub);
  }

  // --- Panel admin ---
  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  findAll() {
    return this.cotizacionesService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.cotizacionesService.findOne(+id);
  }

  @Patch(':id/estado')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  updateEstado(@Param('id') id: string, @Body() dto: UpdateCotizacionDto) {
    return this.cotizacionesService.updateEstado(+id, dto);
  }

  // Responder la consulta y/o marcarla como leída.
  @Patch(':id/admin')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  updateAdmin(@Param('id') id: string, @Body() dto: AdminCotizacionDto) {
    return this.cotizacionesService.updateAdmin(+id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.cotizacionesService.remove(+id);
  }
}
