import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Agrega destino_id (opcional) a cotizaciones. Hasta ahora una cotización
 * solo podía referenciar un paquete (o ser una consulta general). El botón
 * "Consultar" de la ficha de un destino necesita poder guardar sobre qué
 * destino fue la pregunta, igual que ya se hace con paquete_id.
 */
export class AddDestinoIdACotizaciones1784258900153
  implements MigrationInterface
{
  name = 'AddDestinoIdACotizaciones1784258900153';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "cotizaciones"
      ADD COLUMN "destino_id" integer NULL,
      ADD CONSTRAINT "FK_cotizaciones_destino"
        FOREIGN KEY ("destino_id") REFERENCES "destinos" ("id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "cotizaciones"
      DROP CONSTRAINT "FK_cotizaciones_destino",
      DROP COLUMN "destino_id"
    `);
  }
}
