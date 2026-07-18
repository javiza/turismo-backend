import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsUrl,
} from 'class-validator';

export class CreateDestinoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  pais!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  ciudad!: string;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitud?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitud?: number;

  @IsOptional()
  @IsUrl()
  imagenPrincipal?: string;
}
