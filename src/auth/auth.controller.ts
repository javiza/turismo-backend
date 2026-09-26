import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
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
import { CambiarPasswordDto } from '../common/dto/cambiar-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
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

  @Patch('password')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cambia la contraseña del administrador autenticado' })
  @ApiResponse({ status: 401, description: 'La contraseña actual no es correcta' })
  cambiarPassword(@Body() dto: CambiarPasswordDto, @CurrentUser() user: JwtPayload) {
    return this.authService.cambiarPassword(user.sub, dto.passwordActual, dto.passwordNueva);
  }

  // Mismo criterio que en login: límite propio y más estricto que el
  // general de la API, para frenar fuerza bruta y spam de correos.
  @Post('forgot-password')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Solicita un enlace de recuperación de contraseña por email (admin)',
  })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Restablece la contraseña del administrador usando el token recibido por email',
  })
  @ApiResponse({
    status: 400,
    description: 'El enlace de recuperación no es válido o venció',
  })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.passwordNueva);
  }
}
