import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { FinanzasService } from './finanzas.service';
import { CreateMovimientoFinancieroDto } from './dto/create-movimiento-financiero.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('finanzas')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class FinanzasController {
  constructor(private readonly finanzasService: FinanzasService) {}

  @Get('resumen')
  resumen() {
    return this.finanzasService.resumen();
  }

  @Get('ingresos-mensuales')
  ingresosMensuales() {
    return this.finanzasService.ingresosMensuales();
  }

  @Get('top-paquetes')
  topPaquetes() {
    return this.finanzasService.topPaquetes();
  }

  @Get('top-destinos')
  topDestinos() {
    return this.finanzasService.topDestinos();
  }

  // --- Movimientos financieros manuales ---
  // (ingreso/egreso a mano, robo, estafa, pérdida, ajuste — ver nota en
  // finanzas.service.ts sobre por qué se mantienen separados de las
  // cifras que vienen de reservas).

  @Get('movimientos')
  listarMovimientos() {
    return this.finanzasService.listarMovimientos();
  }

  @Post('movimientos')
  registrarMovimiento(
    @Body() dto: CreateMovimientoFinancieroDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.finanzasService.registrarMovimiento(dto, user.sub);
  }

  @Delete('movimientos/:id')
  eliminarMovimiento(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.finanzasService.eliminarMovimiento(id, user.rol);
  }
}
