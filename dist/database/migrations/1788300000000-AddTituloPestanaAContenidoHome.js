"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTituloPestanaAContenidoHome1788300000000 = void 0;
class AddTituloPestanaAContenidoHome1788300000000 {
    name = 'AddTituloPestanaAContenidoHome1788300000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "contenido_home"
      ADD COLUMN "titulo_pestana" text
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "contenido_home"
      DROP COLUMN "titulo_pestana"
    `);
    }
}
exports.AddTituloPestanaAContenidoHome1788300000000 = AddTituloPestanaAContenidoHome1788300000000;
//# sourceMappingURL=1788300000000-AddTituloPestanaAContenidoHome.js.map