import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { JwtClientePayload } from '../interfaces/jwt-cliente-payload.interface';
import { ClientesService } from '../../clientes/clientes.service';

/**
 * Estrategia independiente de JwtStrategy (admin): usa su propio secret
 * (JWT_CLIENTE_SECRET) y su propio nombre de Passport ('jwt-cliente'), así
 * un token de cliente jamás pasa un guard de admin y viceversa, ni por
 * accidente ni por un ataque de "confusión de tokens".
 */
@Injectable()
export class JwtClienteStrategy extends PassportStrategy(
  Strategy,
  'jwt-cliente',
) {
  constructor(
    configService: ConfigService,
    private readonly clientesService: ClientesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_CLIENTE_SECRET'),
    });
  }

  /**
   * Igual que JwtStrategy (admin): se valida contra la base en cada
   * request, así una cuenta desactivada deja de servir de inmediato, y se
   * devuelve el `nombre` FRESCO en vez del que traía el payload original
   * (si el cliente edita su nombre después, el token viejo todavía diría
   * el anterior).
   */
  async validate(payload: JwtClientePayload): Promise<JwtClientePayload> {
    const cliente = await this.clientesService
      .findOne(payload.sub)
      .catch(() => null);

    if (!cliente || !cliente.activo) {
      throw new UnauthorizedException('Cuenta no válida o deshabilitada');
    }

    return {
      sub: cliente.id,
      email: cliente.email,
      nombre: cliente.nombre,
      tipo: 'cliente',
    };
  }
}
