"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLogoUrlAContenidoHome1784700000000 = void 0;
class AddLogoUrlAContenidoHome1784700000000 {
    name = 'AddLogoUrlAContenidoHome1784700000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "contenido_home"
      ADD COLUMN "logo_url" text
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "contenido_home"
      DROP COLUMN "logo_url"
    `);
    }
}
exports.AddLogoUrlAContenidoHome1784700000000 = AddLogoUrlAContenidoHome1784700000000;
//# sourceMappingURL=1784700000000-AddLogoUrlAContenidoHome.js.map