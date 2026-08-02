import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const TAMANO_MAXIMO_BYTES = 5 * 1024 * 1024; // 5 MB

// Los navegadores no son consistentes con el mimetype de archivos de
// fuente (muchos mandan "application/octet-stream"), así que validamos
// por extensión en vez de por mimetype.
const EXTENSIONES_FUENTE_PERMITIDAS = ['.ttf', '.otf', '.woff', '.woff2'];
const TAMANO_MAXIMO_FUENTE_BYTES = 2 * 1024 * 1024; // 2 MB

export interface ImagenSubida {
  url: string;
  publicId: string;
  ancho: number;
  alto: number;
  bytes: number;
}

/**
 * Wrapper sobre el SDK de Cloudinary. Sube imágenes desde memoria (buffer,
 * sin tocar disco) usando un upload_stream, y permite borrarlas por
 * publicId cuando se elimina una imagen de una galería.
 *
 * Se eligió Cloudinary sobre S3/MinIO por simplicidad operativa: no hay que
 * administrar buckets, políticas IAM ni un servidor extra, y ya incluye
 * transformación/optimización de imágenes on-the-fly (útil para las
 * galerías de destinos/paquetes/ofertas).
 */
@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private readonly configured: boolean;

  constructor(private readonly config: ConfigService) {
    const cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.config.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.config.get<string>('CLOUDINARY_API_SECRET');

    this.configured = Boolean(cloudName && apiKey && apiSecret);

    if (!this.configured) {
      this.logger.warn(
        'Cloudinary no configurado (faltan CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET). ' +
          'El endpoint de subida de imágenes devolverá error hasta configurarlo.',
      );
      return;
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }

  validarArchivo(file: Express.Multer.File | undefined): void {
    if (!file) {
      throw new BadRequestException('No se envió ningún archivo');
    }
    if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido (${file.mimetype}). Usa JPG, PNG, WEBP o AVIF.`,
      );
    }
    if (file.size > TAMANO_MAXIMO_BYTES) {
      throw new BadRequestException('El archivo supera el máximo de 5 MB');
    }
  }

  /**
   * Sube una imagen a una carpeta (ej. "destinos", "paquetes", "ofertas")
   * y devuelve una versión ya optimizada (formato/calidad automáticos).
   */
  async subirImagen(
    file: Express.Multer.File,
    carpeta: 'destinos' | 'paquetes' | 'ofertas' | 'contenido' | 'noticias',
  ): Promise<ImagenSubida> {
    this.validarArchivo(file);

    if (!this.configured) {
      throw new InternalServerErrorException(
        'El almacenamiento de imágenes no está configurado en el servidor',
      );
    }

    const resultado = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `turismo/${carpeta}`,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error || !result) {
            return reject(error ?? new Error('Cloudinary no devolvió resultado'));
          }
          resolve(result);
        },
      );
      stream.end(file.buffer);
    });

    return {
      url: resultado.secure_url,
      publicId: resultado.public_id,
      ancho: resultado.width,
      alto: resultado.height,
      bytes: resultado.bytes,
    };
  }

  validarArchivoFuente(file: Express.Multer.File | undefined): void {
    if (!file) {
      throw new BadRequestException('No se envió ningún archivo');
    }
    const extension = file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase();
    if (!EXTENSIONES_FUENTE_PERMITIDAS.includes(extension)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido (${extension || 'sin extensión'}). Usa TTF, OTF, WOFF o WOFF2.`,
      );
    }
    if (file.size > TAMANO_MAXIMO_FUENTE_BYTES) {
      throw new BadRequestException('El archivo supera el máximo de 2 MB');
    }
  }

  /**
   * Sube un archivo de tipografía (.ttf/.otf/.woff/.woff2) a Cloudinary
   * como recurso "raw" (no es una imagen, así que no aplica ninguna
   * transformación) y devuelve su URL. Se usa para que el admin pueda
   * cargar su propia tipografía para el slogan de la home.
   */
  async subirFuente(file: Express.Multer.File): Promise<{ url: string; publicId: string }> {
    this.validarArchivoFuente(file);

    if (!this.configured) {
      throw new InternalServerErrorException(
        'El almacenamiento de archivos no está configurado en el servidor',
      );
    }

    const resultado = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'turismo/contenido/fuentes',
          resource_type: 'raw',
          // Conserva el nombre original (con extensión) como public_id
          // para que la URL resultante sirva directo como @font-face src,
          // ya que Cloudinary por defecto no le pone extensión a los
          // recursos "raw".
          public_id: file.originalname.replace(/\s+/g, '_'),
          use_filename: true,
          unique_filename: true,
          overwrite: false,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error ?? new Error('Cloudinary no devolvió resultado'));
          }
          resolve(result);
        },
      );
      stream.end(file.buffer);
    });

    return { url: resultado.secure_url, publicId: resultado.public_id };
  }

  async eliminarImagen(publicId: string): Promise<void> {
    if (!this.configured) {
      return;
    }

    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      // No romper el flujo de negocio por un error al borrar en Cloudinary;
      // en el peor caso queda una imagen huérfana allá, que no afecta a la BD.
      this.logger.warn(
        `No se pudo eliminar la imagen ${publicId} en Cloudinary: ${(error as Error).message}`,
      );
    }
  }
}
