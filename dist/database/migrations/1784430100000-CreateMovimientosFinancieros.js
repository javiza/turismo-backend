"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMovimientosFinancieros1784430100000 = void 0;
class CreateMovimientosFinancieros1784430100000 {
    name = 'CreateMovimientosFinancieros1784430100000';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "movimientos_financieros" (
        "id" SERIAL PRIMARY KEY,
        "tipo" varchar(30) NOT NULL,
        "monto" numeric(12,2) NOT NULL,
        "descripcion" text NOT NULL,
        "usuario_id" bigint NULL REFERENCES "usuarios"("id") ON DELETE SET NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
        await queryRunner.query(`
      CREATE INDEX "idx_movimientos_financieros_tipo"
      ON "movimientos_financieros" ("tipo")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "movimientos_financieros"`);
    }
}
exports.CreateMovimientosFinancieros1784430100000 = CreateMovimientosFinancieros1784430100000;
//# sourceMappingURL=1784430100000-CreateMovimientosFinancieros.js.map