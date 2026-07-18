import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  /**
   * Antes, esto devolvía el payload del token tal cual, sin tocar la base
   * de datos: un usuario desactivado con `UsersService.deactivate()`
   * seguía siendo aceptado como autenticado hasta que su token expirara
   * (hasta JWT_ACCESS_EXPIRES). Ahora se valida contra la base en cada
   * request, así una desactivación aplica de inmediato.
   *
   * Además: se devuelve el `rol` FRESCO de la base, no el del payload
   * original. Si a un admin le cambian el rol después de emitido el
   * token, el payload viejo todavía dice el rol anterior — devolverlo tal
   * cual dejaría que RolesGuard decida permisos con un dato desactualizado.
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const user = await this.usersService.findOne(payload.sub).catch(() => null);

    if (!user || !user.activo) {
      throw new UnauthorizedException('Usuario no válido o deshabilitado');
    }

    return { sub: user.id, email: user.email, rol: user.rol };
  }
}
