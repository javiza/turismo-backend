"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddNoticiaIdACotizaciones1786100000000 = void 0;
class AddNoticiaIdACotizaciones1786100000000 {
    name = 'AddNoticiaIdACotizaciones1786100000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "cotizaciones"
      ADD COLUMN "noticia_id" integer NULL,
      ADD CONSTRAINT "FK_cotizaciones_noticia"
        FOREIGN KEY ("noticia_id") REFERENCES "noticias" ("id")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "cotizaciones"
      DROP CONSTRAINT "FK_cotizaciones_noticia",
      DROP COLUMN "noticia_id"
    `);
    }
}
exports.AddNoticiaIdACotizaciones1786100000000 = AddNoticiaIdACotizaciones1786100000000;
//# sourceMappingURL=1786100000000-AddNoticiaIdACotizaciones.js.map