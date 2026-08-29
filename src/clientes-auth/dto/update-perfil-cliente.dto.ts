import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

/** Edición del propio perfil por el cliente autenticado (el password sigue yendo por su ruta dedicada). */
export class UpdatePerfilClienteDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombre?: string;

  // El email es el usuario de login: se permite editarlo, pero el
  // service valida que no choque con la cuenta de otro cliente antes
  // de guardarlo (ver ClientesService.actualizar).
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  rut?: string;

  // Contactos adicionales al principal (ver Cliente entity).
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  telefonosAdicionales?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsEmail({}, { each: true })
  @MaxLength(150, { each: true })
  correosAdicionales?: string[];
}
