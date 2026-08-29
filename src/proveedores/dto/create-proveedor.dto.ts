import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

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

  // URL ya subida a Cloudinary (ver POST /proveedores/imagen); el
  // formulario público la sube primero y manda la URL resultante acá,
  // igual que el resto de formularios con imagen del sitio.
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  imagenUrl?: string;

  // Precio referencial opcional (ej: "desde cuánto" cuesta el servicio),
  // solo informativo para que el admin lo vea al revisar el registro.
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioReferencial?: number;
}
