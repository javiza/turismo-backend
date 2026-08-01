import { IsString, MinLength, MaxLength } from 'class-validator';

export class ResetPasswordClienteDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(8, {
    message: 'La nueva contraseña debe tener al menos 8 caracteres',
  })
  @MaxLength(100)
  passwordNueva!: string;
}
