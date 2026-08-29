"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateContenidoHome1784255618463 = void 0;
class CreateContenidoHome1784255618463 {
    name = 'CreateContenidoHome1784255618463';
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "contenido_home"`);
    }
}
exports.CreateContenidoHome1784255618463 = CreateContenidoHome1784255618463;
//# sourceMappingURL=1784255618463-CreateContenidoHome.js.map