"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFechaDesactivacionAPaquetesYOfertas1785100100000 = void 0;
class AddFechaDesactivacionAPaquetesYOfertas1785100100000 {
    name = 'AddFechaDesactivacionAPaquetesYOfertas1785100100000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "paquetes"
      ADD COLUMN "fecha_desactivacion" timestamp
    `);
        await queryRunner.query(`
      ALTER TABLE "ofertas"
      ADD COLUMN "fecha_desactivacion" timestamp
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "paquetes"
      DROP COLUMN "fecha_desactivacion"
    `);
        await queryRunner.query(`
      ALTER TABLE "ofertas"
      DROP COLUMN "fecha_desactivacion"
    `);
    }
}
exports.AddFechaDesactivacionAPaquetesYOfertas1785100100000 = AddFechaDesactivacionAPaquetesYOfertas1785100100000;
//# sourceMappingURL=1785100100000-AddFechaDesactivacionAPaquetesYOfertas.js.map