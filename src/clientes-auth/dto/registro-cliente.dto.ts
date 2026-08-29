import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegistroClienteDto {
  @IsString()
  @MaxLength(150)
  nombre!: string;

  @IsEmail()
  @MaxLength(150)
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  rut?: string;

  // Contactos adicionales al principal (ver Cliente entity). Opcionales:
  // el registro sigue funcionando igual sin ellos.
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
