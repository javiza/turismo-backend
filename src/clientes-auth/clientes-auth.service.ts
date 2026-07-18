import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { ClientesService } from '../clientes/clientes.service';
import { Cliente } from '../clientes/entities/cliente.entity';
import { RegistroClienteDto } from './dto/registro-cliente.dto';
import { LoginClienteDto } from './dto/login-cliente.dto';
import { RefreshTokenClienteDto } from './dto/refresh-token-cliente.dto';
import { ReservasService } from '../reservas/reservas.service';
import { CotizacionesService } from '../cotizaciones/cotizaciones.service';
import { JwtClientePayload } from './interfaces/jwt-cliente-payload.interface';
import { tokenMatches } from '../common/utils/token-hash';

@Injectable()
export class ClientesAuthService {
  constructor(
    private readonly clientesService: ClientesService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly reservasService: ReservasService,
    private readonly cotizacionesService: CotizacionesService,
  ) {}

  async registro(dto: RegistroClienteDto) {
    const cliente = await this.clientesService.registrar(dto);
    const tokens = this.getTokens(cliente);
    await this.clientesService.updateRefreshToken(
      cliente.id,
      tokens.refresh_token,
    );
    return tokens;
  }

  async login(dto: LoginClienteDto) {
    const cliente = await this.clientesService.findByEmail(dto.email);

    if (!cliente) throw new UnauthorizedException('Credenciales inválidas');

    const passwordMatch = await bcrypt.compare(dto.password, cliente.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!cliente.activo) {
      throw new UnauthorizedException('Cuenta deshabilitada');
    }

    const tokens = this.getTokens(cliente);
    await this.clientesService.updateRefreshToken(
      cliente.id,
      tokens.refresh_token,
    );
    return tokens;
  }

  /** Mismo criterio de rotación que AuthService.refresh() (admin), ver comentario ahí. */
  async refresh(dto: RefreshTokenClienteDto) {
    let payload: JwtClientePayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtClientePayload>(
        dto.refreshToken,
        { secret: this.config.getOrThrow<string>('JWT_CLIENTE_REFRESH_SECRET') },
      );
    } catch {
      throw new UnauthorizedException('Refresh token inválido o vencido');
    }

    const cliente = await this.clientesService.findByEmail(payload.email);

    if (!cliente || !cliente.activo || !cliente.hashedRefreshToken) {
      throw new UnauthorizedException('Sesión no válida');
    }

    const coincide = tokenMatches(dto.refreshToken, cliente.hashedRefreshToken);
    if (!coincide) {
      throw new UnauthorizedException('Sesión no válida');
    }

    const tokens = this.getTokens(cliente);
    await this.clientesService.updateRefreshToken(
      cliente.id,
      tokens.refresh_token,
    );
    return tokens;
  }

  async logout(clienteId: number): Promise<void> {
    await this.clientesService.clearRefreshToken(clienteId);
  }

  async perfil(clienteId: number) {
    return this.clientesService.findOne(clienteId);
  }

  async misReservas(clienteId: number) {
    return this.reservasService.findByCliente(clienteId);
  }

  async misCotizaciones(clienteId: number) {
    return this.cotizacionesService.findByCliente(clienteId);
  }

  private getTokens(cliente: Cliente) {
    const payload: JwtClientePayload = {
      sub: cliente.id,
      email: cliente.email,
      nombre: cliente.nombre,
      tipo: 'cliente',
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.config.getOrThrow<string>('JWT_CLIENTE_SECRET'),
        expiresIn: this.config.getOrThrow<string>('JWT_CLIENTE_ACCESS_EXPIRES') as
          | number
          | `${number}${'s' | 'm' | 'h' | 'd'}`
          | undefined,
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.config.getOrThrow<string>('JWT_CLIENTE_REFRESH_SECRET'),
        expiresIn: this.config.getOrThrow<string>('JWT_CLIENTE_REFRESH_EXPIRES') as
          | number
          | `${number}${'s' | 'm' | 'h' | 'd'}`
          | undefined,
      }),
    };
  }
}
