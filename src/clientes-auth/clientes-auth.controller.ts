import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { ClientesAuthService } from './clientes-auth.service';
import { RegistroClienteDto } from './dto/registro-cliente.dto';
import { UpdatePerfilClienteDto } from './dto/update-perfil-cliente.dto';
import { LoginClienteDto } from './dto/login-cliente.dto';
import { RefreshTokenClienteDto } from './dto/refresh-token-cliente.dto';
import { CambiarPasswordDto } from '../common/dto/cambiar-password.dto';
import { ForgotPasswordClienteDto } from './dto/forgot-password-cliente.dto';
import { ResetPasswordClienteDto } from './dto/reset-password-cliente.dto';
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
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas o cuenta deshabilitada',
  })
  login(@Body() dto: LoginClienteDto) {
    return this.clientesAuthService.login(dto);
  }

  // Rotación, igual que /auth/refresh (admin) — ver comentario en
  // ClientesAuthService.refresh().
  @Post('refresh')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Renueva access_token y refresh_token del cliente (con rotación)',
  })
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

  // Mismo throttle que login/registro: evita que se use para enumerar
  // masivamente qué correos están registrados o para spamear bandejas.
  @Post('forgot-password')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Solicita un enlace de recuperación de contraseña por email',
  })
  forgotPassword(@Body() dto: ForgotPasswordClienteDto) {
    return this.clientesAuthService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Restablece la contraseña usando el token recibido por email',
  })
  @ApiResponse({
    status: 400,
    description: 'El enlace de recuperación no es válido o venció',
  })
  resetPassword(@Body() dto: ResetPasswordClienteDto) {
    return this.clientesAuthService.resetPassword(dto.token, dto.passwordNueva);
  }

  @Get('perfil')
  @ApiBearerAuth('JWT-cliente')
  @UseGuards(JwtClienteAuthGuard)
  perfil(@CurrentCliente() cliente: JwtClientePayload) {
    return this.clientesAuthService.perfil(cliente.sub);
  }

  @Patch('perfil')
  @ApiBearerAuth('JWT-cliente')
  @UseGuards(JwtClienteAuthGuard)
  @ApiOperation({
    summary: 'Edita nombre/teléfono/RUT del cliente autenticado',
  })
  actualizarPerfil(
    @Body() dto: UpdatePerfilClienteDto,
    @CurrentCliente() cliente: JwtClientePayload,
  ) {
    return this.clientesAuthService.actualizarPerfil(cliente.sub, dto);
  }

  @Patch('password')
  @ApiBearerAuth('JWT-cliente')
  @UseGuards(JwtClienteAuthGuard)
  @ApiOperation({ summary: 'Cambia la contraseña del cliente autenticado' })
  @ApiResponse({
    status: 401,
    description: 'La contraseña actual no es correcta',
  })
  cambiarPassword(
    @Body() dto: CambiarPasswordDto,
    @CurrentCliente() cliente: JwtClientePayload,
  ) {
    return this.clientesAuthService.cambiarPassword(
      cliente.sub,
      dto.passwordActual,
      dto.passwordNueva,
    );
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

  // Cancelar (no elimina) una reserva propia. Se verifica pertenencia
  // dentro del service antes de tocar cualquier registro.
  @Patch('mis-reservas/:id/cancelar')
  @ApiBearerAuth('JWT-cliente')
  @UseGuards(JwtClienteAuthGuard)
  @ApiOperation({
    summary: 'Cancela una reserva propia del cliente autenticado',
  })
  cancelarReserva(
    @Param('id') id: string,
    @CurrentCliente() cliente: JwtClientePayload,
  ) {
    return this.clientesAuthService.cancelarReserva(+id, cliente.sub);
  }
}
