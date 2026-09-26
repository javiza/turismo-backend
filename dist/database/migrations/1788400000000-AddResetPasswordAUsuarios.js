"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddResetPasswordAUsuarios1788400000000 = void 0;
class AddResetPasswordAUsuarios1788400000000 {
    name = 'AddResetPasswordAUsuarios1788400000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "usuarios"
      ADD COLUMN "reset_password_token" varchar(255),
      ADD COLUMN "reset_password_expires" TIMESTAMP
    `);
        await queryRunner.query(`
      CREATE INDEX "idx_usuarios_reset_password_token" ON "usuarios" ("reset_password_token")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "idx_usuarios_reset_password_token"`);
        await queryRunner.query(`
      ALTER TABLE "usuarios"
      DROP COLUMN "reset_password_token",
      DROP COLUMN "reset_password_expires"
    `);
    }
}
exports.AddResetPasswordAUsuarios1788400000000 = AddResetPasswordAUsuarios1788400000000;
//# sourceMappingURL=1788400000000-AddResetPasswordAUsuarios.js.map