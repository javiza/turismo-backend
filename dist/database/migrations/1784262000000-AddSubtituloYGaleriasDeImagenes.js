"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSubtituloYGaleriasDeImagenes1784262000000 = void 0;
class AddSubtituloYGaleriasDeImagenes1784262000000 {
    name = 'AddSubtituloYGaleriasDeImagenes1784262000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "contenido_home"
      ADD COLUMN "subtitulo" text NOT NULL DEFAULT '',
      ADD COLUMN "nombre_agencia" text NOT NULL DEFAULT 'Tu Agencia de Viajes'
    `);
        await queryRunner.query(`
      ALTER TABLE "destino_imagenes"
      ADD COLUMN "es_principal" boolean NOT NULL DEFAULT false
    `);
        await queryRunner.query(`
      UPDATE "destino_imagenes" di
      SET "es_principal" = true
      FROM "destinos" d
      WHERE di.destino_id = d.id
        AND d.imagen_principal IS NOT NULL
        AND di.url = d.imagen_principal
    `);
        await queryRunner.query(`
      ALTER TABLE "paquetes"
      ADD COLUMN "imagen_principal" text
    `);
        await queryRunner.query(`
      CREATE TABLE "paquete_imagenes" (
        "id" BIGSERIAL PRIMARY KEY,
        "paquete_id" BIGINT NOT NULL REFERENCES "paquetes"(id) ON DELETE CASCADE,
        "url" text NOT NULL,
        "es_principal" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
        await queryRunner.query(`
      ALTER TABLE "ofertas"
      ADD COLUMN "imagen_principal" text
    `);
        await queryRunner.query(`
      CREATE TABLE "oferta_imagenes" (
        "id" BIGSERIAL PRIMARY KEY,
        "oferta_id" BIGINT NOT NULL REFERENCES "ofertas"(id) ON DELETE CASCADE,
        "url" text NOT NULL,
        "es_principal" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "oferta_imagenes"`);
        await queryRunner.query(`ALTER TABLE "ofertas" DROP COLUMN "imagen_principal"`);
        await queryRunner.query(`DROP TABLE "paquete_imagenes"`);
        await queryRunner.query(`ALTER TABLE "paquetes" DROP COLUMN "imagen_principal"`);
        await queryRunner.query(`ALTER TABLE "destino_imagenes" DROP COLUMN "es_principal"`);
        await queryRunner.query(`ALTER TABLE "contenido_home" DROP COLUMN "subtitulo", DROP COLUMN "nombre_agencia"`);
    }
}
exports.AddSubtituloYGaleriasDeImagenes1784262000000 = AddSubtituloYGaleriasDeImagenes1784262000000;
//# sourceMappingURL=1784262000000-AddSubtituloYGaleriasDeImagenes.js.map