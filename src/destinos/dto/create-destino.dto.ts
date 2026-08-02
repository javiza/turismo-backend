import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsUrl,
  IsArray,
  ArrayMaxSize,
  IsDateString,
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

  // Rango en que el destino está disponible como servicio. Obligatorio
  // al crear (igual que en paquetes); UpdateDestinoDto lo deja opcional
  // automáticamente vía PartialType.
  @IsDateString()
  fechaInicio!: string;

  @IsDateString()
  fechaFin!: string;

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

  // Precio referencial ("Desde $X") que el admin puede cargar o dejar
  // vacío. No está atado a los paquetes del destino.
  @IsOptional()
  @IsNumber()
  @Min(0)
  precioDesde?: number;

  @IsOptional()
  @IsUrl()
  imagenPrincipal?: string;

  // Imágenes iniciales de la galería (opcional). Si se envían y no se
  // indica imagenPrincipal, la primera de la lista queda como principal.
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsUrl({}, { each: true })
  imagenes?: string[];
}
