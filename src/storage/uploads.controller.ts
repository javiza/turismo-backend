import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ParseEnumPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';

import { CloudinaryService } from './cloudinary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';

enum CarpetaUpload {
  destinos = 'destinos',
  paquetes = 'paquetes',
  ofertas = 'ofertas',
  contenido = 'contenido',
  noticias = 'noticias',
}

/**
 * Endpoint genérico de subida de imágenes: sube el archivo a Cloudinary y
 * devuelve la URL. Esa URL es la que el front manda después a los
 * endpoints existentes (POST /destinos/:id/imagenes, etc. — ver
 * AgregarImagenDto), así que este controlador no toca la BD directamente.
 *
 * Solo admins pueden subir imágenes (mismo criterio que el resto de
 * operaciones de escritura del catálogo).
 */
@Controller('uploads')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class UploadsController {
  constructor(private readonly cloudinary: CloudinaryService) {}

  @Post('imagenes/:carpeta')
  @ApiOperation({
    summary: 'Sube una imagen a Cloudinary y devuelve su URL',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('archivo', {
      storage: undefined, // memoria (buffer), no se escribe a disco
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async subir(
    @Param('carpeta', new ParseEnumPipe(CarpetaUpload)) carpeta: CarpetaUpload,
    @UploadedFile() archivo: Express.Multer.File,
  ) {
    return this.cloudinary.subirImagen(archivo, carpeta);
  }

  // Subida de una tipografía propia (.ttf/.otf/.woff/.woff2) para el
  // slogan de la home. Va en un endpoint aparte del de imágenes porque
  // valida extensión/tamaño distintos y sube como recurso "raw" en vez
  // de "image".
  @Post('fuentes')
  @ApiOperation({
    summary:
      'Sube un archivo de tipografía (TTF/OTF/WOFF/WOFF2) y devuelve su URL',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('archivo', {
      storage: undefined, // memoria (buffer), no se escribe a disco
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  async subirFuente(@UploadedFile() archivo: Express.Multer.File) {
    return this.cloudinary.subirFuente(archivo);
  }
}
