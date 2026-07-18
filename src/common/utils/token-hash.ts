import { createHash, timingSafeEqual } from 'crypto';

/**
 * Hash para refresh tokens (NO para contraseñas).
 *
 * Antes se guardaban con bcrypt, igual que las contraseñas. Eso agregaba
 * una segunda operación bcrypt (costosa a propósito, ~100-300ms+ con
 * BCRYPT_ROUNDS=12) en CADA login y CADA refresh, además de la que ya
 * hace bcrypt.compare() sobre la contraseña — de ahí la lentitud al
 * iniciar sesión.
 *
 * bcrypt está pensado para proteger secretos de baja entropía elegidos
 * por humanos (contraseñas), donde la lentitud es la defensa contra
 * fuerza bruta. Un refresh token no es eso: ya es un JWT firmado de alta
 * entropía (imposible de adivinar por fuerza bruta), así que basta con
 * un hash rápido y determinístico como SHA-256 para no guardarlo en
 * texto plano en la base de datos. La comparación se hace en tiempo
 * constante para evitar timing attacks.
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function tokenMatches(rawToken: string, hashedToken: string): boolean {
  const a = Buffer.from(hashToken(rawToken), 'hex');
  const b = Buffer.from(hashedToken, 'hex');

  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}
