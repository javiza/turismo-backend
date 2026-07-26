import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Agrega a contenido_home la imagen de fondo del hero (home pública) y
 * del banner de la sesión de cliente:
 * - hero_imagen_url: URL de la imagen (subida a Cloudinary desde el
 *   panel admin, carpeta "contenido", o pegada como URL externa).
 *   Nullable: mientras no se cargue una, el frontend usa la imagen por
 *   defecto que trae el proyecto (/public/images/hero-playa.webp).
 * - hero_imagen_pos_x / hero_imagen_pos_y: posición del encuadre en
 *   porcentaje (0-100), equivalente a `object-position: X% Y%`. Permite
 *   elegir qué sección de la foto queda visible cuando no entra
 *   completa en el recuadro del hero.
 * - hero_imagen_zoom: porcentaje de zoom (100 = sin zoom, >100 acerca
 *   la imagen), para poder recortar/ampliar una parte específica en vez
 *   de mostrarla siempre completa.
 */
export class AddHeroImagenAContenidoHome1785300000000
  implements MigrationInterface
{
  name = 'AddHeroImagenAContenidoHome1785300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contenido_home"
      ADD COLUMN "hero_imagen_url" text,
      ADD COLUMN "hero_imagen_pos_x" double precision NOT NULL DEFAULT 50,
      ADD COLUMN "hero_imagen_pos_y" double precision NOT NULL DEFAULT 50,
      ADD COLUMN "hero_imagen_zoom" double precision NOT NULL DEFAULT 100
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contenido_home"
      DROP COLUMN "hero_imagen_url",
      DROP COLUMN "hero_imagen_pos_x",
      DROP COLUMN "hero_imagen_pos_y",
      DROP COLUMN "hero_imagen_zoom"
    `);
  }
}
