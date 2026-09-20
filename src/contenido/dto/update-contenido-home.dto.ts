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

// Keys de las tipografías generales del sitio (texto y títulos). Deben
// coincidir con FUENTES_SITIO en el frontend (src/lib/fuentes-sitio.ts).
export const FUENTES_SITIO_KEYS = [
  'inter',
  'poppins',
  'roboto',
  'open-sans',
  'lato',
  'montserrat',
  'nunito',
  'dm-sans',
  'fraunces',
  'playfair-display',
  'merriweather',
  'lora',
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

  // Color de fondo general del sitio y color del navbar. "" se usa para
  // quitar la personalización y volver a los tonos por defecto.
  @IsOptional()
  @IsString()
  @Matches(/^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}))?$/, {
    message: 'colorFondo debe ser un color hexadecimal, ej: #f8fbff',
  })
  colorFondo?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}))?$/, {
    message: 'colorNavbar debe ser un color hexadecimal, ej: #f8fbff',
  })
  colorNavbar?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}))?$/, {
    message: 'colorFooter debe ser un color hexadecimal, ej: #f8fbff',
  })
  colorFooter?: string;

  // Color de fondo de los rectángulos/tarjetas del sitio. "" = volver al
  // blanco por defecto.
  @IsOptional()
  @IsString()
  @Matches(/^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}))?$/, {
    message: 'colorTarjetas debe ser un color hexadecimal, ej: #ffffff',
  })
  colorTarjetas?: string;

  // URL del favicon (la que devuelve POST /uploads/favicon). "" = quitarlo.
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  faviconUrl?: string;

  // Tipografía general: preseleccionada (key) y/o propia (URL de
  // POST /uploads/fuentes). "" en *Url = quitar la propia.
  @IsOptional()
  @IsString()
  @IsIn(FUENTES_SITIO_KEYS, {
    message: `fuenteTexto debe ser una de: ${FUENTES_SITIO_KEYS.join(', ')}`,
  })
  fuenteTexto?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  fuenteTextoUrl?: string;

  @IsOptional()
  @IsString()
  @IsIn(FUENTES_SITIO_KEYS, {
    message: `fuenteTitulos debe ser una de: ${FUENTES_SITIO_KEYS.join(', ')}`,
  })
  fuenteTitulos?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  fuenteTitulosUrl?: string;

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
