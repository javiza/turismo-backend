import {
  IsInt,
  IsPositive,
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsDateString,
  IsNumber,
  Min,
  Max,
  IsUrl,
  IsArray,
  ArrayMaxSize,
} from 'class-validator';

export class CreateOfertaDto {
  @IsInt()
  @IsPositive()
  paqueteId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titulo!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  descuento!: number;

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

  @IsOptional()
  @IsUrl()
  imagenPrincipal?: string;
}
