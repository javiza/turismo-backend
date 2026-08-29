import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

/**
 * Edición de un cliente desde el panel admin: nombre, teléfono y RUT.
 * No incluye email/password (eso es del propio cliente, vía
 * clientes-auth) ni activo (tiene sus propios endpoints
 * deactivate/reactivate, para que quede explícito en el historial qué
 * acción se tomó).
 */
export class UpdateClienteAdminDto {
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
