import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombreNegocio!: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  rubro?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombreContacto!: string;

  @IsEmail()
  @MaxLength(150)
  correo!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  telefono!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  direccion?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  descripcion!: string;
}
