"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPrecioDesdeADestinos1786000000000 = void 0;
class AddPrecioDesdeADestinos1786000000000 {
    name = 'AddPrecioDesdeADestinos1786000000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "destinos"
      ADD COLUMN "precio_desde" numeric(12,2)
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "destinos"
      DROP COLUMN "precio_desde"
    `);
    }
}
exports.AddPrecioDesdeADestinos1786000000000 = AddPrecioDesdeADestinos1786000000000;
//# sourceMappingURL=1786000000000-AddPrecioDesdeADestinos.js.map