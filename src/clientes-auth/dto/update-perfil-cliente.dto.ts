import { IsOptional, IsString, MaxLength } from 'class-validator';

/** Edición del propio perfil por el cliente autenticado (sin email/password: esos van por rutas dedicadas). */
export class UpdatePerfilClienteDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  rut?: string;
}
