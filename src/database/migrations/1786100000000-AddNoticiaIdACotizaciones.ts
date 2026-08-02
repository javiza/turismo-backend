import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Agrega noticia_id (opcional) a cotizaciones. El botón "Consultas al
 * administrador" que aparece en cada noticia necesita poder guardar sobre
 * qué noticia fue la pregunta, igual que ya se hace con paquete_id y
 * destino_id (ver AddDestinoIdACotizaciones).
 */
export class AddNoticiaIdACotizaciones1786100000000 implements MigrationInterface {
  name = 'AddNoticiaIdACotizaciones1786100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "cotizaciones"
      ADD COLUMN "noticia_id" integer NULL,
      ADD CONSTRAINT "FK_cotizaciones_noticia"
        FOREIGN KEY ("noticia_id") REFERENCES "noticias" ("id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "cotizaciones"
      DROP CONSTRAINT "FK_cotizaciones_noticia",
      DROP COLUMN "noticia_id"
    `);
  }
}
