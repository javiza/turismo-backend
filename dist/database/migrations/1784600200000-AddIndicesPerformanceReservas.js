"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIndicesPerformanceReservas1784600200000 = void 0;
class AddIndicesPerformanceReservas1784600200000 {
    name = 'AddIndicesPerformanceReservas1784600200000';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE INDEX "idx_reservas_estado" ON "reservas" ("estado")
    `);
        await queryRunner.query(`
      CREATE INDEX "idx_reservas_fecha_reserva" ON "reservas" ("fecha_reserva")
    `);
        await queryRunner.query(`
      CREATE INDEX "idx_reservas_paquete_id_estado" ON "reservas" ("paquete_id", "estado")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "idx_reservas_paquete_id_estado"`);
        await queryRunner.query(`DROP INDEX "idx_reservas_fecha_reserva"`);
        await queryRunner.query(`DROP INDEX "idx_reservas_estado"`);
    }
}
exports.AddIndicesPerformanceReservas1784600200000 = AddIndicesPerformanceReservas1784600200000;
//# sourceMappingURL=1784600200000-AddIndicesPerformanceReservas.js.map