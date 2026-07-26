import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CloudinaryService } from './cloudinary.service';

function crearConfig(valores: Record<string, string> = {}) {
  return { get: jest.fn((key: string) => valores[key]) } as unknown as ConfigService;
}

describe('CloudinaryService', () => {
  describe('validarArchivo', () => {
    let service: CloudinaryService;

    beforeEach(() => {
      service = new CloudinaryService(crearConfig());
    });

    it('rechaza si no hay archivo', () => {
      expect(() => service.validarArchivo(undefined)).toThrow(BadRequestException);
    });

    it('rechaza tipos MIME no permitidos', () => {
      const archivo = { mimetype: 'application/pdf', size: 1000 } as Express.Multer.File;
      expect(() => service.validarArchivo(archivo)).toThrow(BadRequestException);
    });

    it('rechaza archivos mayores a 5MB', () => {
      const archivo = {
        mimetype: 'image/png',
        size: 6 * 1024 * 1024,
      } as Express.Multer.File;
      expect(() => service.validarArchivo(archivo)).toThrow(BadRequestException);
    });

    it('acepta un archivo válido sin lanzar', () => {
      const archivo = { mimetype: 'image/webp', size: 1024 } as Express.Multer.File;
      expect(() => service.validarArchivo(archivo)).not.toThrow();
    });
  });

  describe('sin credenciales configuradas', () => {
    it('subirImagen lanza InternalServerErrorException (servidor mal configurado, no error del usuario)', async () => {
      const service = new CloudinaryService(crearConfig({}));
      const archivo = { mimetype: 'image/png', size: 1024, buffer: Buffer.from('x') } as Express.Multer.File;

      await expect(service.subirImagen(archivo, 'destinos')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('eliminarImagen no lanza (no-op silencioso) si Cloudinary no está configurado', async () => {
      const service = new CloudinaryService(crearConfig({}));
      await expect(service.eliminarImagen('algun-id')).resolves.toBeUndefined();
    });
  });
});
