"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSloganFontAContenidoHome1785200000000 = void 0;
class AddSloganFontAContenidoHome1785200000000 {
    name = 'AddSloganFontAContenidoHome1785200000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "contenido_home"
      ADD COLUMN "slogan_font_family" text NOT NULL DEFAULT 'caveat',
      ADD COLUMN "slogan_font_url" text
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "contenido_home"
      DROP COLUMN "slogan_font_family",
      DROP COLUMN "slogan_font_url"
    `);
    }
}
exports.AddSloganFontAContenidoHome1785200000000 = AddSloganFontAContenidoHome1785200000000;
//# sourceMappingURL=1785200000000-AddSloganFontAContenidoHome.js.map