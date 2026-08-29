"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRutAUsuarios1785500000000 = void 0;
class AddRutAUsuarios1785500000000 {
    name = 'AddRutAUsuarios1785500000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "usuarios"
      ADD COLUMN "rut" varchar(20)
    `);
        await queryRunner.query(`
      CREATE INDEX "idx_usuarios_rut" ON "usuarios" ("rut")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "idx_usuarios_rut"`);
        await queryRunner.query(`
      ALTER TABLE "usuarios"
      DROP COLUMN "rut"
    `);
    }
}
exports.AddRutAUsuarios1785500000000 = AddRutAUsuarios1785500000000;
//# sourceMappingURL=1785500000000-AddRutAUsuarios.js.map