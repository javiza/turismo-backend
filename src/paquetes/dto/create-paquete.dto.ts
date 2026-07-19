import {
  IsInt,
  IsPositive,
  IsString,
  IsNotEmpty,
  MaxLength,
  IsDateString,
  IsNumber,
  Min,
  IsOptional,
  IsUrl,
  IsArray,
  ArrayMaxSize,
} from 'class-validator';

export class CreatePaqueteDto {
  @IsInt()
  @IsPositive()
  destinoId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio!: number;

  @IsInt()
  @Min(0)
  cupos!: number;

  @IsDateString()
  fechaInicio!: string;

  @IsDateString()
  fechaFin!: string;

  // Imágenes iniciales de la galería (opcional). Si se envían y no se
  // indica imagenPrincipal, la primera de la lista queda como principal.
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsUrl({}, { each: true })
  imagenes?: string[];

  // Debe ser una de las urls incluidas en `imagenes` (o, si no se manda
  // `imagenes`, se guarda igual como imagen_principal del paquete).
  @IsOptional()
  @IsUrl()
  imagenPrincipal?: string;
}
