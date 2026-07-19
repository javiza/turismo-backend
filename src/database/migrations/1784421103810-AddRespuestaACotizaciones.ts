import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Agrega soporte para que el admin responda una cotización directamente
 * desde el panel (en vez de solo cambiar el estado a RESPONDIDA sin dejar
 * registro de qué se respondió). "leida" es independiente del estado:
 * permite marcar una consulta como revisada aunque todavía no se le haya
 * escrito una respuesta.
 */
export class AddRespuestaACotizaciones1784421103810
  implements MigrationInterface
{
  name = 'AddRespuestaACotizaciones1784421103810';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "cotizaciones"
      ADD COLUMN "respuesta" text NULL,
      ADD COLUMN "respondido_en" TIMESTAMP NULL,
      ADD COLUMN "leida" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "cotizaciones"
      DROP COLUMN "respuesta",
      DROP COLUMN "respondido_en",
      DROP COLUMN "leida"
    `);
  }
}
