import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Igual que JwtClienteAuthGuard, pero NUNCA lanza si no hay token o es
 * inválido — simplemente deja `request.user` en `undefined`.
 *
 * Se usa en endpoints públicos (crear reserva, crear cotización) que
 * deben seguir aceptando "checkout como invitado", pero que si el
 * visitante SÍ tiene sesión de cliente iniciada, quieren vincular
 * automáticamente el registro a su cuenta sin que el cliente tenga que
 * hacer nada extra.
 */
@Injectable()
export class OptionalJwtClienteAuthGuard extends AuthGuard('jwt-cliente') {
  handleRequest<TUser = unknown>(err: unknown, user: TUser): TUser {
    // A propósito no relanza `err` ni chequea `info`: cualquier situación
    // (sin header, token vencido, token inválido) simplemente resulta en
    // "no autenticado", no en un 401 — este guard nunca debe bloquear.
    // Passport deja `user` en `false` cuando no pudo autenticar; se
    // normaliza a `undefined` para que el controller pueda usar `?.` sin
    // ambigüedad.
    return (user || undefined) as TUser;
  }
}
