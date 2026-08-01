import { IsString, MinLength, MaxLength } from 'class-validator';

/**
 * Compartido entre /auth/password (admin) y /clientes-auth/password
 * (cliente): cualquier usuario autenticado puede cambiar su propia
 * contraseña conociendo la actual. No es un reseteo de contraseña
 * olvidada (eso requeriría un flujo de verificación por email aparte,
 * que no existe todavía) — este endpoint exige la contraseña actual
 * para evitar que una sesión robada (access token filtrado) pueda
 * secuestrar la cuenta cambiando la contraseña sin saber la original.
 */
export class CambiarPasswordDto {
  @IsString()
  passwordActual!: string;

  @IsString()
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
  @MaxLength(100)
  passwordNueva!: string;
}
