import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { AdminUpdateReservaDto } from './dto/admin-update-reserva.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';
import { JwtClienteAuthGuard } from '../clientes-auth/guards/jwt-cliente-auth.guard';
import { CurrentCliente } from '../common/decorators/current-cliente.decorator';
import type { JwtClientePayload } from '../clientes-auth/interfaces/jwt-cliente-payload.interface';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  // El checkout como invitado quedó deshabilitado: solo un cliente con
  // sesión iniciada puede reservar (cualquier paquete/servicio). El
  // guard rechaza con 401 si no viene un token de cliente válido, y la
  // reserva siempre queda vinculada a esa cuenta (cliente.sub).
  @Post()
  @ApiBearerAuth('JWT-cliente')
  @UseGuards(JwtClienteAuthGuard)
  create(
    @Body() dto: CreateReservaDto,
    @CurrentCliente() cliente: JwtClientePayload,
  ) {
    return this.reservasService.create(dto, cliente.sub);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  findAll() {
    return this.reservasService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.reservasService.findOne(+id);
  }

  @Patch(':id/estado')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  updateEstado(@Param('id') id: string, @Body() dto: UpdateReservaDto) {
    return this.reservasService.updateEstado(+id, dto);
  }

  // Edición completa (datos de contacto, personas, monto, estado).
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: AdminUpdateReservaDto) {
    return this.reservasService.update(+id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.reservasService.remove(+id);
  }
}
