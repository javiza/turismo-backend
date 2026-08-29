"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPrecioAnteriorAPaquetes1784430000000 = void 0;
class AddPrecioAnteriorAPaquetes1784430000000 {
    name = 'AddPrecioAnteriorAPaquetes1784430000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "paquetes"
      ADD COLUMN "precio_anterior" numeric(12,2) NULL
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "paquetes"
      DROP COLUMN "precio_anterior"
    `);
    }
}
exports.AddPrecioAnteriorAPaquetes1784430000000 = AddPrecioAnteriorAPaquetes1784430000000;
//# sourceMappingURL=1784430000000-AddPrecioAnteriorAPaquetes.js.map