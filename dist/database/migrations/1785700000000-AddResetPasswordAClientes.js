"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddResetPasswordAClientes1785700000000 = void 0;
class AddResetPasswordAClientes1785700000000 {
    name = 'AddResetPasswordAClientes1785700000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "clientes"
      ADD COLUMN "reset_password_token" varchar(255),
      ADD COLUMN "reset_password_expires" TIMESTAMP
    `);
        await queryRunner.query(`
      CREATE INDEX "idx_clientes_reset_password_token" ON "clientes" ("reset_password_token")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "idx_clientes_reset_password_token"`);
        await queryRunner.query(`
      ALTER TABLE "clientes"
      DROP COLUMN "reset_password_token",
      DROP COLUMN "reset_password_expires"
    `);
    }
}
exports.AddResetPasswordAClientes1785700000000 = AddResetPasswordAClientes1785700000000;
//# sourceMappingURL=1785700000000-AddResetPasswordAClientes.js.map