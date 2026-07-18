import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from './interfaces/jwt-payload.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Límite propio, más estricto que el general de la API (100/min): login
  // es el endpoint clásico para ataques de fuerza bruta, así que el
  // límite acá es a propósito mucho más bajo.
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Login de administrador' })
  @ApiResponse({ status: 201, description: 'access_token + refresh_token' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas o usuario deshabilitado' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Rotación: cada refresh invalida el refresh token usado y entrega uno
  // nuevo. No lleva JwtAuthGuard (no usa el access token) — se autentica
  // con el refresh token del body, verificado adentro de AuthService.
  @Post('refresh')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @ApiOperation({ summary: 'Renueva access_token y refresh_token (con rotación)' })
  @ApiResponse({ status: 201, description: 'Nuevo access_token + refresh_token' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido, vencido o ya usado' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Invalida la sesión actual (el refresh token deja de servir)' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada' })
  async logout(@CurrentUser() user: JwtPayload) {
    await this.authService.logout(user.sub);
    return { message: 'Sesión cerrada correctamente' };
  }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Perfil del administrador autenticado' })
  profile(@CurrentUser() user: JwtPayload) {
    return this.authService.profile(user.sub);
  }
}
