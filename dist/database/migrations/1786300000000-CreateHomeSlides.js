"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHomeSlides1786300000000 = void 0;
class CreateHomeSlides1786300000000 {
    name = 'CreateHomeSlides1786300000000';
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."IDX_home_slides_activo_orden"`);
        await queryRunner.query(`DROP TABLE "home_slides"`);
        await queryRunner.query(`DROP TYPE "public"."home_slides_tipo_enum"`);
    }
}
exports.CreateHomeSlides1786300000000 = CreateHomeSlides1786300000000;
//# sourceMappingURL=1786300000000-CreateHomeSlides.js.map