"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFaviconTipografiaYColorTarjetasAContenidoHome1788200000000 = void 0;
class AddFaviconTipografiaYColorTarjetasAContenidoHome1788200000000 {
    name = 'AddFaviconTipografiaYColorTarjetasAContenidoHome1788200000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "contenido_home"
      ADD COLUMN "favicon_url" text,
      ADD COLUMN "color_tarjetas" varchar(20),
      ADD COLUMN "fuente_texto" varchar(50) NOT NULL DEFAULT 'inter',
      ADD COLUMN "fuente_texto_url" text,
      ADD COLUMN "fuente_titulos" varchar(50) NOT NULL DEFAULT 'fraunces',
      ADD COLUMN "fuente_titulos_url" text
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "contenido_home"
      DROP COLUMN "favicon_url",
      DROP COLUMN "color_tarjetas",
      DROP COLUMN "fuente_texto",
      DROP COLUMN "fuente_texto_url",
      DROP COLUMN "fuente_titulos",
      DROP COLUMN "fuente_titulos_url"
    `);
    }
}
exports.AddFaviconTipografiaYColorTarjetasAContenidoHome1788200000000 = AddFaviconTipografiaYColorTarjetasAContenidoHome1788200000000;
//# sourceMappingURL=1788200000000-AddFaviconTipografiaYColorTarjetasAContenidoHome.js.map