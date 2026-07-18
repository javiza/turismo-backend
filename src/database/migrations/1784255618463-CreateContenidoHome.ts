import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Tabla "singleton" (siempre una sola fila, id = 1) con el contenido
 * editable de la página de inicio: presentación, misión, visión y
 * valores. Antes de esta migración ese texto estaba hardcodeado en el
 * frontend; ahora lo administra el panel admin vía ContenidoModule.
 */
export class CreateContenidoHome1784255618463 implements MigrationInterface {
  name = 'CreateContenidoHome1784255618463';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "contenido_home" (
        "id" integer PRIMARY KEY DEFAULT 1,
        "presentacion" text NOT NULL DEFAULT '',
        "mision" text NOT NULL DEFAULT '',
        "vision" text NOT NULL DEFAULT '',
        "valores" text NOT NULL DEFAULT '',
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "CK_contenido_home_singleton" CHECK ("id" = 1)
      )
    `);

    await queryRunner.query(`
      INSERT INTO "contenido_home" ("id", "presentacion", "mision", "vision", "valores")
      VALUES (
        1,
        'Somos una agencia de turismo dedicada a conectar viajeros con destinos inolvidables.',
        'Facilitar experiencias de viaje memorables, seguras y accesibles para nuestros clientes.',
        'Ser la agencia de turismo de referencia, reconocida por la calidad de nuestro servicio.',
        'Compromiso, transparencia y pasión por viajar.'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "contenido_home"`);
  }
}
