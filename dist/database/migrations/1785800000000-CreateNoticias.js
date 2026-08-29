"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNoticias1785800000000 = void 0;
class CreateNoticias1785800000000 {
    name = 'CreateNoticias1785800000000';
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."IDX_noticias_activa_created_at"`);
        await queryRunner.query(`DROP TABLE "noticias"`);
    }
}
exports.CreateNoticias1785800000000 = CreateNoticias1785800000000;
//# sourceMappingURL=1785800000000-CreateNoticias.js.map