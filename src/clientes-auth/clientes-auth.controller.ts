import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { ClientesAuthService } from './clientes-auth.service';
import { RegistroClienteDto } from './dto/registro-cliente.dto';
import { LoginClienteDto } from './dto/login-cliente.dto';
import { RefreshTokenClienteDto } from './dto/refresh-token-cliente.dto';
import { JwtClienteAuthGuard } from './guards/jwt-cliente-auth.guard';
import { CurrentCliente } from '../common/decorators/current-cliente.decorator';
import type { JwtClientePayload } from './interfaces/jwt-cliente-payload.interface';

/**
 * Rutas públicas de autenticación para clientes finales (no admins). Las
 * reservas/cotizaciones en sí siguen viviendo en sus propios módulos —
 * este controller solo maneja la cuenta del cliente.
 */
@ApiTags('Clientes Auth')
@Controller('clientes-auth')
export class ClientesAuthController {
  constructor(private readonly clientesAuthService: ClientesAuthService) {}

  // Mismo criterio que en registro/login de admin: límite propio y más
  // estricto que el general de la API, para frenar fuerza bruta y
  // creación masiva de cuentas.
  @Post('registro')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Crea una cuenta de cliente' })
  registro(@Body() dto: RegistroClienteDto) {
    return this.clientesAuthService.registro(dto);
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Login de cliente' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas o cuenta deshabilitada' })
  login(@Body() dto: LoginClienteDto) {
    return this.clientesAuthService.login(dto);
  }

  // Rotación, igual que /auth/refresh (admin) — ver comentario en
  // ClientesAuthService.refresh().
  @Post('refresh')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @ApiOperation({ summary: 'Renueva access_token y refresh_token del cliente (con rotación)' })
  refresh(@Body() dto: RefreshTokenClienteDto) {
    return this.clientesAuthService.refresh(dto);
  }

  @Post('logout')
  @ApiBearerAuth('JWT-cliente')
  @UseGuards(JwtClienteAuthGuard)
  @ApiOperation({ summary: 'Invalida la sesión actual del cliente' })
  async logout(@CurrentCliente() cliente: JwtClientePayload) {
    await this.clientesAuthService.logout(cliente.sub);
    return { message: 'Sesión cerrada correctamente' };
  }

  @Get('perfil')
  @ApiBearerAuth('JWT-cliente')
  @UseGuards(JwtClienteAuthGuard)
  perfil(@CurrentCliente() cliente: JwtClientePayload) {
    return this.clientesAuthService.perfil(cliente.sub);
  }

  @Get('mis-reservas')
  @ApiBearerAuth('JWT-cliente')
  @UseGuards(JwtClienteAuthGuard)
  misReservas(@CurrentCliente() cliente: JwtClientePayload) {
    return this.clientesAuthService.misReservas(cliente.sub);
  }

  @Get('mis-cotizaciones')
  @ApiBearerAuth('JWT-cliente')
  @UseGuards(JwtClienteAuthGuard)
  misCotizaciones(@CurrentCliente() cliente: JwtClientePayload) {
    return this.clientesAuthService.misCotizaciones(cliente.sub);
  }
}
