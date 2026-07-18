import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { tokenMatches } from '../common/utils/token-hash';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    // Mismo mensaje genérico tanto si el email no existe como si la
    // contraseña es incorrecta, a propósito: no le damos a un atacante
    // información sobre qué emails están registrados.
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Bug corregido: un usuario desactivado (UsersService.deactivate())
    // podía igual loguearse, porque este chequeo no existía.
    if (!user.activo) {
      throw new UnauthorizedException('Usuario deshabilitado');
    }

    const tokens = this.getTokens(user);
    await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  /**
   * Rotación de refresh token: el refresh token recibido se valida (firma
   * + expiración + que coincida con el hash guardado) y se descarta —
   * cada refresh emite un access Y un refresh nuevos, e invalida el
   * anterior guardando el hash del nuevo. Si alguien reutiliza un refresh
   * token viejo (por ejemplo, uno robado y ya usado por el dueño legítimo)
   * el hash guardado ya no va a coincidir y esto falla.
   */
  async refresh(dto: RefreshTokenDto) {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(
        dto.refreshToken,
        { secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET') },
      );
    } catch {
      throw new UnauthorizedException('Refresh token inválido o vencido');
    }

    const user = await this.usersService.findByEmail(payload.email);

    if (!user || !user.activo || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Sesión no válida');
    }

    const coincide = tokenMatches(dto.refreshToken, user.hashedRefreshToken);
    if (!coincide) {
      throw new UnauthorizedException('Sesión no válida');
    }

    const tokens = this.getTokens(user);
    await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  /** Invalida el refresh token actual: cualquier POST /auth/refresh posterior con el token viejo va a fallar la comparación de arriba. */
  async logout(userId: number): Promise<void> {
    await this.usersService.clearRefreshToken(userId);
  }

  async profile(userId: number) {
    return this.usersService.findOne(userId);
  }

  private getTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      rol: user.rol,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
        expiresIn: this.config.getOrThrow<string>('JWT_ACCESS_EXPIRES') as JwtSignOptions['expiresIn'],
      }),

      refresh_token: this.jwtService.sign(payload, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.getOrThrow<string>('JWT_REFRESH_EXPIRES') as JwtSignOptions['expiresIn'],
      }),
    };
  }
}
