"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRutAClientes1785400000000 = void 0;
class AddRutAClientes1785400000000 {
    name = 'AddRutAClientes1785400000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "clientes"
      ADD COLUMN "rut" varchar(20)
    `);
        await queryRunner.query(`
      CREATE INDEX "idx_clientes_rut" ON "clientes" ("rut")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "idx_clientes_rut"`);
        await queryRunner.query(`
      ALTER TABLE "clientes"
      DROP COLUMN "rut"
    `);
    }
}
exports.AddRutAClientes1785400000000 = AddRutAClientes1785400000000;
//# sourceMappingURL=1785400000000-AddRutAClientes.js.map