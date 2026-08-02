import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Personalización de la paleta del sitio desde el panel admin: color de
 * fondo general y color del navbar. Nullable a propósito — mientras el
 * admin no elija uno, el frontend cae en los tonos por defecto de la
 * paleta (ver globals.css: --color-fondo-app / --color-navbar-app).
 */
export class AddColoresAContenidoHome1785900000000 implements MigrationInterface {
  name = 'AddColoresAContenidoHome1785900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contenido_home"
      ADD COLUMN "color_fondo" varchar(20),
      ADD COLUMN "color_navbar" varchar(20)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contenido_home"
      DROP COLUMN "color_fondo",
      DROP COLUMN "color_navbar"
    `);
  }
}
