import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Agrega a contenido_home:
 *  - titulo: el titular grande de la home (ej. "Programa tus vacaciones
 *    con nosotros"), editable desde el panel admin.
 *  - resenas: reseñas/testimonios de clientes que se muestran en la home,
 *    para transmitir seriedad y confianza. Se guardan como JSONB (array de
 *    objetos {nombre, texto, valoracion}) porque es una lista de largo
 *    variable que el admin arma libremente, no una tabla relacional con
 *    necesidades de consulta propias.
 */
export class AddTituloYResenasAContenidoHome1784258800153
  implements MigrationInterface
{
  name = 'AddTituloYResenasAContenidoHome1784258800153';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contenido_home"
      ADD COLUMN "titulo" text NOT NULL DEFAULT 'Programa tus vacaciones con nosotros',
      ADD COLUMN "resenas" jsonb NOT NULL DEFAULT '[]'::jsonb
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contenido_home"
      DROP COLUMN "titulo",
      DROP COLUMN "resenas"
    `);
  }
}
