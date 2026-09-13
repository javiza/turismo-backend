import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ConfiguracionService } from './configuracion.service';
import { ClaveIntegracion } from './entities/configuracion-integracion.entity';
import {
  ActualizarSmtpDto,
  ActualizarWhatsappDto,
  ActualizarTransbankDto,
  ActualizarMercadoPagoDto,
} from './dto/configuracion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

/** Muestra solo los últimos 4 caracteres de un secreto, para que el admin confirme cuál tiene guardado sin exponerlo completo. */
function enmascarar(valor: string): string {
  if (!valor) return '';
  if (valor.length <= 4) return '••••';
  return `••••${valor.slice(-4)}`;
}

@ApiTags('Configuración (credenciales de integraciones)')
@ApiBearerAuth('JWT-auth')
@Controller('configuracion')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class ConfiguracionController {
  constructor(private readonly service: ConfiguracionService) {}

  // --- SMTP (correo transaccional) ---

  @Get('smtp')
  @ApiOperation({ summary: 'Estado actual de la config SMTP (contraseña enmascarada)' })
  async obtenerSmtp() {
    const cfg = await this.service.obtenerSmtp();
    const estado = await this.service.obtenerEstado(ClaveIntegracion.SMTP);
    return {
      ...cfg,
      password: enmascarar(cfg.password),
      configurado: Boolean(cfg.host && cfg.user && cfg.password),
      ...estado,
    };
  }

  @Patch('smtp')
  @ApiOperation({ summary: 'Actualiza las credenciales SMTP' })
  async actualizarSmtp(@Body() dto: ActualizarSmtpDto, @CurrentUser() user: JwtPayload) {
    const actual = await this.service.obtenerSmtp();
    await this.service.guardar(
      ClaveIntegracion.SMTP,
      {
        host: dto.host,
        port: dto.port,
        user: dto.user,
        // Si el admin deja la contraseña vacía, se asume que no la quiso
        // cambiar y se conserva la que ya había (nunca se sobreescribe
        // con "" solo porque el campo llegó vacío del formulario).
        password: dto.password || actual.password,
        from: dto.from,
        adminEmail: dto.adminEmail,
      },
      user.sub,
    );
    return { message: 'Configuración SMTP actualizada' };
  }

  // --- WhatsApp Business Cloud API ---

  @Get('whatsapp')
  @ApiOperation({ summary: 'Estado actual de la config de WhatsApp (token enmascarado)' })
  async obtenerWhatsapp() {
    const cfg = await this.service.obtenerWhatsapp();
    const estado = await this.service.obtenerEstado(ClaveIntegracion.WHATSAPP);
    return {
      ...cfg,
      token: enmascarar(cfg.token),
      configurado: Boolean(cfg.token && cfg.phoneNumberId && cfg.adminNumber),
      ...estado,
    };
  }

  @Patch('whatsapp')
  @ApiOperation({ summary: 'Actualiza las credenciales de WhatsApp Business Cloud API' })
  async actualizarWhatsapp(
    @Body() dto: ActualizarWhatsappDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const actual = await this.service.obtenerWhatsapp();
    await this.service.guardar(
      ClaveIntegracion.WHATSAPP,
      {
        token: dto.token || actual.token,
        phoneNumberId: dto.phoneNumberId,
        adminNumber: dto.adminNumber,
        apiVersion: dto.apiVersion || actual.apiVersion,
      },
      user.sub,
    );
    return { message: 'Configuración de WhatsApp actualizada' };
  }

  // --- Transbank Webpay Plus ---

  @Get('transbank')
  @ApiOperation({ summary: 'Estado actual de la config de Transbank (API key enmascarada)' })
  async obtenerTransbank() {
    const cfg = await this.service.obtenerTransbank();
    const estado = await this.service.obtenerEstado(ClaveIntegracion.TRANSBANK);
    return {
      ...cfg,
      apiKey: enmascarar(cfg.apiKey),
      configurado: Boolean(cfg.commerceCode && cfg.apiKey),
      ...estado,
    };
  }

  @Patch('transbank')
  @ApiOperation({ summary: 'Actualiza las credenciales de Transbank Webpay Plus' })
  async actualizarTransbank(
    @Body() dto: ActualizarTransbankDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const actual = await this.service.obtenerTransbank();
    await this.service.guardar(
      ClaveIntegracion.TRANSBANK,
      {
        commerceCode: dto.commerceCode,
        apiKey: dto.apiKey || actual.apiKey,
        environment: dto.environment,
      },
      user.sub,
    );
    return { message: 'Configuración de Transbank actualizada' };
  }

  // --- Mercado Pago ---

  @Get('mercadopago')
  @ApiOperation({ summary: 'Estado actual de la config de Mercado Pago (access token enmascarado)' })
  async obtenerMercadoPago() {
    const cfg = await this.service.obtenerMercadoPago();
    const estado = await this.service.obtenerEstado(ClaveIntegracion.MERCADOPAGO);
    return {
      ...cfg,
      accessToken: enmascarar(cfg.accessToken),
      configurado: Boolean(cfg.accessToken && cfg.publicKey),
      ...estado,
    };
  }

  @Patch('mercadopago')
  @ApiOperation({ summary: 'Actualiza las credenciales de Mercado Pago' })
  async actualizarMercadoPago(
    @Body() dto: ActualizarMercadoPagoDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const actual = await this.service.obtenerMercadoPago();
    await this.service.guardar(
      ClaveIntegracion.MERCADOPAGO,
      {
        accessToken: dto.accessToken || actual.accessToken,
        publicKey: dto.publicKey,
      },
      user.sub,
    );
    return { message: 'Configuración de Mercado Pago actualizada' };
  }
}
