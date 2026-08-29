"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddColoresAContenidoHome1785900000000 = void 0;
class AddColoresAContenidoHome1785900000000 {
    name = 'AddColoresAContenidoHome1785900000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "contenido_home"
      ADD COLUMN "color_fondo" varchar(20),
      ADD COLUMN "color_navbar" varchar(20)
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "contenido_home"
      DROP COLUMN "color_fondo",
      DROP COLUMN "color_navbar"
    `);
    }
}
exports.AddColoresAContenidoHome1785900000000 = AddColoresAContenidoHome1785900000000;
//# sourceMappingURL=1785900000000-AddColoresAContenidoHome.js.map