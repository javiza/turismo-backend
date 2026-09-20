import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Amplía la personalización del sitio desde el panel admin:
 *  - favicon_url: ícono de la pestaña del navegador (subido desde el
 *    computador del admin). Nullable: sin favicon, no se declara ninguno.
 *  - color_tarjetas: color de fondo de los rectángulos/tarjetas (<Card>)
 *    de todo el sitio. Nullable: sin valor, el frontend usa blanco.
 *  - fuente_texto / fuente_titulos: tipografía general del sitio (key de
 *    una preseleccionada, ver src/lib/fuentes-sitio.ts en el frontend) y
 *    fuente_*_url: tipografía propia subida (TTF/OTF/WOFF/WOFF2) que, si
 *    existe, tiene prioridad sobre la preseleccionada. Los defaults son
 *    las fuentes que el sitio ya usaba (Inter y Fraunces), así que la
 *    migración no cambia el aspecto actual.
 */
export class AddFaviconTipografiaYColorTarjetasAContenidoHome1788200000000
  implements MigrationInterface
{
  name = 'AddFaviconTipografiaYColorTarjetasAContenidoHome1788200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contenido_home"
      ADD COLUMN "favicon_url" text,
      ADD COLUMN "color_tarjetas" varchar(20),
      ADD COLUMN "fuente_texto" varchar(50) NOT NULL DEFAULT 'inter',
      ADD COLUMN "fuente_texto_url" text,
      ADD COLUMN "fuente_titulos" varchar(50) NOT NULL DEFAULT 'fraunces',
      ADD COLUMN "fuente_titulos_url" text
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contenido_home"
      DROP COLUMN "favicon_url",
      DROP COLUMN "color_tarjetas",
      DROP COLUMN "fuente_texto",
      DROP COLUMN "fuente_texto_url",
      DROP COLUMN "fuente_titulos",
      DROP COLUMN "fuente_titulos_url"
    `);
  }
}
