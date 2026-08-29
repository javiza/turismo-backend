"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDetallePagoAMovimientosFinancieros1785600000000 = void 0;
class AddDetallePagoAMovimientosFinancieros1785600000000 {
    name = 'AddDetallePagoAMovimientosFinancieros1785600000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "movimientos_financieros"
      ADD COLUMN "cliente_id" integer,
      ADD COLUMN "pagador_nombre" varchar(150),
      ADD COLUMN "metodo_pago" varchar(30)
    `);
        await queryRunner.query(`
      ALTER TABLE "movimientos_financieros"
      ADD CONSTRAINT "fk_movimientos_financieros_cliente"
      FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL
    `);
        await queryRunner.query(`
      CREATE INDEX "idx_movimientos_financieros_cliente_id"
      ON "movimientos_financieros" ("cliente_id")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "idx_movimientos_financieros_cliente_id"`);
        await queryRunner.query(`
      ALTER TABLE "movimientos_financieros"
      DROP CONSTRAINT "fk_movimientos_financieros_cliente"
    `);
        await queryRunner.query(`
      ALTER TABLE "movimientos_financieros"
      DROP COLUMN "cliente_id",
      DROP COLUMN "pagador_nombre",
      DROP COLUMN "metodo_pago"
    `);
    }
}
exports.AddDetallePagoAMovimientosFinancieros1785600000000 = AddDetallePagoAMovimientosFinancieros1785600000000;
//# sourceMappingURL=1785600000000-AddDetallePagoAMovimientosFinancieros.js.map