import {
  IsInt,
  IsPositive,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCotizacionDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  paqueteId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  destinoId?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre!: string;

  @IsEmail()
  @MaxLength(150)
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  cantidadPersonas?: number;

  @IsOptional()
  @IsString()
  mensaje?: string;
}
