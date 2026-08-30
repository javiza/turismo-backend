"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddColorFooterAContenidoHome1786000000000 = void 0;
class AddColorFooterAContenidoHome1786000000000 {
    name = 'AddColorFooterAContenidoHome1786000000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "contenido_home"
      ADD COLUMN "color_footer" varchar(20)
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "contenido_home"
      DROP COLUMN "color_footer"
    `);
    }
}
exports.AddColorFooterAContenidoHome1786000000000 = AddColorFooterAContenidoHome1786000000000;
//# sourceMappingURL=1786000000000-AddColorFooterAContenidoHome.js.map