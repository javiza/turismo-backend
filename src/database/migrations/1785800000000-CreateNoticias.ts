import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Sección "Noticias" del panel admin: el administrador redacta noticias
 * que se muestran en el sitio público (solo las que tienen activa=true).
 * El borrado es siempre definitivo (DELETE real, sin soft-delete) — ver
 * NoticiasService.remove().
 */
export class CreateNoticias1785800000000 implements MigrationInterface {
  name = 'CreateNoticias1785800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "noticias" (
        "id" SERIAL PRIMARY KEY,
        "titulo" character varying(200) NOT NULL,
        "contenido" text NOT NULL,
        "imagen_url" text,
        "activa" boolean NOT NULL DEFAULT true,
        "autor_id" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_noticias_autor" FOREIGN KEY ("autor_id")
          REFERENCES "usuarios" ("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_noticias_activa_created_at" ON "noticias" ("activa", "created_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_noticias_activa_created_at"`);
    await queryRunner.query(`DROP TABLE "noticias"`);
  }
}
