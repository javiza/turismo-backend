import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Slide/carrusel destacado de la home del cliente logueado: cada fila es
 * un servicio (destino/paquete/oferta/noticia) elegido por el admin para
 * destacar, con su orden de aparición. Los datos que se muestran
 * (título, descripción, precio, fechas, imagen) NO se copian acá — se
 * resuelven en caliente contra la tabla del tipo correspondiente (ver
 * SlidesService.resolver), así que no hay que sincronizar nada cuando el
 * admin edita el destino/paquete/oferta/noticia original.
 */
export class CreateHomeSlides1786300000000 implements MigrationInterface {
  name = 'CreateHomeSlides1786300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."home_slides_tipo_enum" AS ENUM ('destino', 'paquete', 'oferta', 'noticia')
    `);

    await queryRunner.query(`
      CREATE TABLE "home_slides" (
        "id" SERIAL PRIMARY KEY,
        "tipo" "public"."home_slides_tipo_enum" NOT NULL,
        "referencia_id" integer NOT NULL,
        "orden" integer NOT NULL DEFAULT 0,
        "activo" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_home_slides_activo_orden" ON "home_slides" ("activo", "orden")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_home_slides_activo_orden"`,
    );
    await queryRunner.query(`DROP TABLE "home_slides"`);
    await queryRunner.query(`DROP TYPE "public"."home_slides_tipo_enum"`);
  }
}
