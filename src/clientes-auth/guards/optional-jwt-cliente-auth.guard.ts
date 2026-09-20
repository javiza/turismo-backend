import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Igual que JwtClienteAuthGuard, pero NUNCA lanza si no hay token o es
 * inválido — simplemente deja `request.user` en `undefined`.
 *
 * Se usa en endpoints públicos que deben seguir aceptando invitados sin
 * cuenta (hoy: crear cotización), pero que si el visitante SÍ tiene
 * sesión de cliente iniciada, quieren vincular automáticamente el
 * registro a su cuenta sin que tenga que hacer nada extra. Nota: crear
 * reserva ya NO usa este guard — reservar exige cuenta (ver
 * ReservasController), a diferencia de pedir una cotización.
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
