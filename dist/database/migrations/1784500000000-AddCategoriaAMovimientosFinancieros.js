"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCategoriaAMovimientosFinancieros1784500000000 = void 0;
class AddCategoriaAMovimientosFinancieros1784500000000 {
    name = 'AddCategoriaAMovimientosFinancieros1784500000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "movimientos_financieros"
      ADD COLUMN "categoria" varchar(30) NULL
    `);
        await queryRunner.query(`
      CREATE INDEX "idx_movimientos_financieros_categoria"
      ON "movimientos_financieros" ("categoria")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "idx_movimientos_financieros_categoria"`);
        await queryRunner.query(`ALTER TABLE "movimientos_financieros" DROP COLUMN "categoria"`);
    }
}
exports.AddCategoriaAMovimientosFinancieros1784500000000 = AddCategoriaAMovimientosFinancieros1784500000000;
//# sourceMappingURL=1784500000000-AddCategoriaAMovimientosFinancieros.js.map