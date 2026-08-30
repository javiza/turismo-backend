import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Completa la personalización de paleta iniciada en
 * AddColoresAContenidoHome: agrega el color del footer, que el
 * frontend (dashboard/admin/contenido y layout.tsx, --color-footer-app)
 * ya esperaba pero que nunca se agregó en el backend. Nullable por el
 * mismo motivo que color_fondo / color_navbar: mientras el admin no
 * elija uno, el frontend cae en el tono por defecto.
 */
export class AddColorFooterAContenidoHome1786000000000
  implements MigrationInterface
{
  name = 'AddColorFooterAContenidoHome1786000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contenido_home"
      ADD COLUMN "color_footer" varchar(20)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contenido_home"
      DROP COLUMN "color_footer"
    `);
  }
}
