import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CloudinaryService, detectarTipoFavicon } from './cloudinary.service';

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

  describe('favicon', () => {
    const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const ICO = Buffer.from([0x00, 0x00, 0x01, 0x00, 0x01, 0x00]);
    const JPG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    const SVG = Buffer.from(
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg"></svg>',
    );
    const WEBP = Buffer.from('RIFF\x00\x00\x00\x00WEBPVP8 ', 'binary');

    it('detecta PNG, ICO, JPEG y SVG por su firma (sin depender del mimetype)', () => {
      expect(detectarTipoFavicon(PNG)).toBe('png');
      expect(detectarTipoFavicon(ICO)).toBe('ico');
      expect(detectarTipoFavicon(JPG)).toBe('jpeg');
      expect(detectarTipoFavicon(SVG)).toBe('svg');
    });

    it('rechaza formatos que no sirven como favicon (WEBP, texto cualquiera, vacío)', () => {
      expect(detectarTipoFavicon(WEBP)).toBeNull();
      expect(detectarTipoFavicon(Buffer.from('hola mundo'))).toBeNull();
      expect(detectarTipoFavicon(Buffer.alloc(0))).toBeNull();
    });

    it('validarArchivoFavicon acepta un .ico aunque el mimetype sea raro', () => {
      const service = new CloudinaryService(crearConfig());
      const archivo = {
        mimetype: 'application/octet-stream',
        size: ICO.length,
        buffer: ICO,
      } as Express.Multer.File;
      expect(service.validarArchivoFavicon(archivo)).toBe('ico');
    });

    it('validarArchivoFavicon rechaza si no hay archivo, si pesa más de 1MB o si el contenido no es una imagen válida', () => {
      const service = new CloudinaryService(crearConfig());
      expect(() => service.validarArchivoFavicon(undefined)).toThrow(
        BadRequestException,
      );
      expect(() =>
        service.validarArchivoFavicon({
          size: 2 * 1024 * 1024,
          buffer: PNG,
        } as Express.Multer.File),
      ).toThrow(BadRequestException);
      // Un .exe renombrado a .png no pasa: se mira el contenido real.
      expect(() =>
        service.validarArchivoFavicon({
          mimetype: 'image/png',
          size: 10,
          buffer: Buffer.from('MZ\x90\x00binario'),
        } as Express.Multer.File),
      ).toThrow(BadRequestException);
    });

    it('subirFavicon lanza InternalServerError si Cloudinary no está configurado', async () => {
      const service = new CloudinaryService(crearConfig({}));
      await expect(
        service.subirFavicon({
          size: PNG.length,
          buffer: PNG,
        } as Express.Multer.File),
      ).rejects.toThrow(InternalServerErrorException);
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
