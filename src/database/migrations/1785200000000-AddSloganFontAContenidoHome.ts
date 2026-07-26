import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Agrega a contenido_home:
 * - slogan_font_family: key de la tipografía preseleccionada para el
 *   slogan (ver FUENTES_SLOGAN en el frontend, ej. 'caveat',
 *   'dancing-script', 'pacifico'...). Default 'caveat' porque es la que
 *   ya se usaba a fuego (ver navbar.tsx antes de este cambio), para que
 *   instalaciones existentes no cambien de aspecto al migrar.
 * - slogan_font_url: URL (Cloudinary) de una tipografía subida por el
 *   admin (.ttf/.otf/.woff/.woff2). Nullable: mientras no se suba una
 *   propia, se usa la preseleccionada de slogan_font_family.
 */
export class AddSloganFontAContenidoHome1785200000000
  implements MigrationInterface
{
  name = 'AddSloganFontAContenidoHome1785200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contenido_home"
      ADD COLUMN "slogan_font_family" text NOT NULL DEFAULT 'caveat',
      ADD COLUMN "slogan_font_url" text
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contenido_home"
      DROP COLUMN "slogan_font_family",
      DROP COLUMN "slogan_font_url"
    `);
  }
}
