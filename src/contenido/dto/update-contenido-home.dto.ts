import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  MaxLength,
  ValidateNested,
  IsArray,
  ArrayMaxSize,
  Matches,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

// Keys de las tipografías preseleccionadas para el slogan. Deben
// coincidir con FUENTES_SLOGAN en el frontend (src/lib/slogan-fonts.ts):
// si agregas una fuente ahí, agrégala también acá.
export const FUENTES_SLOGAN_KEYS = [
  'caveat',
  'dancing-script',
  'pacifico',
  'sacramento',
  'shadows-into-light',
] as const;

class ResenaHomeDto {
  @IsString()
  @MaxLength(150)
  nombre!: string;

  @IsString()
  @MaxLength(1000)
  texto!: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  valoracion?: number;
}

export class UpdateContenidoHomeDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombreAgencia?: string;

  // Acepta tanto la URL que devuelve Cloudinary al subir un archivo como
  // una URL externa pegada a mano; "" se usa para quitar el logo actual.
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  logoUrl?: string;

  // Color de la frase que acompaña al logo (Navbar/Footer). Se valida
  // como hex (#rgb o #rrggbb) porque se aplica directo como inline
  // style de color en el frontend.
  @IsOptional()
  @IsString()
  @Matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
    message: 'sloganColor debe ser un color hexadecimal, ej: #c2410c',
  })
  sloganColor?: string;

  // Tipografía preseleccionada del slogan. Se ignora en el render
  // público si sloganFontUrl está seteado.
  @IsOptional()
  @IsString()
  @IsIn(FUENTES_SLOGAN_KEYS, {
    message: `sloganFontFamily debe ser una de: ${FUENTES_SLOGAN_KEYS.join(', ')}`,
  })
  sloganFontFamily?: string;

  // URL de una tipografía propia subida a Cloudinary (endpoint
  // POST /uploads/fuentes). "" se usa para quitarla y volver a la
  // preseleccionada de sloganFontFamily.
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  sloganFontUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  titulo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  subtitulo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  presentacion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  mision?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  vision?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  valores?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => ResenaHomeDto)
  resenas?: ResenaHomeDto[];

  // Datos de contacto mostrados en el footer público. "" se usa para
  // borrar el dato ya cargado.
  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  correo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  direccion?: string;

  // Imagen de fondo del hero: URL (Cloudinary o externa pegada a mano).
  // "" se usa para quitarla y volver a la imagen por defecto del sitio.
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  heroImagenUrl?: string;

  // Posición del encuadre en % (0-100), igual a CSS object-position.
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  heroImagenPosX?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  heroImagenPosY?: number;

  // Zoom en % — 100 a 300 (100 = tamaño normal, hasta 3x para recortar
  // una sección pequeña de la imagen).
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(300)
  heroImagenZoom?: number;
}
