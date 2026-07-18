import { Controller, Get, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsEventoDto } from './dto/create-analytics-evento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // --- Público: el frontend registra eventos de interacción ---
  @Post('eventos')
  @HttpCode(204)
  async registrarEvento(@Body() dto: CreateAnalyticsEventoDto) {
    await this.analyticsService.registrarEvento(dto);
  }

  // --- Panel admin: dashboard y reportes ---
  @Get('dashboard')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  dashboard() {
    return this.analyticsService.dashboard();
  }

  @Get('top-destinos')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  topDestinos() {
    return this.analyticsService.topDestinos();
  }

  @Get('top-paquetes')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  topPaquetes() {
    return this.analyticsService.topPaquetes();
  }

  @Get('tendencia-mensual')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  tendenciaMensual() {
    return this.analyticsService.tendenciaMensual();
  }

  @Get('ventas-mensuales')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  ventasMensuales() {
    return this.analyticsService.ventasMensuales();
  }

  @Post('refrescar-vistas')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async refrescarVistas() {
    await this.analyticsService.refrescarVistas();
    return { ok: true };
  }
}
