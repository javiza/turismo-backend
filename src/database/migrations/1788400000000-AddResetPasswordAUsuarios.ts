import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Soporte para "olvidé mi contraseña" (administradores). Mismo criterio
 * que AddResetPasswordAClientes1785700000000: el token de reseteo se
 * guarda hasheado (SHA-256, ver common/utils/token-hash.ts), nunca en
 * texto plano, y la expiración vive en su propia columna.
 */
export class AddResetPasswordAUsuarios1788400000000 implements MigrationInterface {
  name = 'AddResetPasswordAUsuarios1788400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "usuarios"
      ADD COLUMN "reset_password_token" varchar(255),
      ADD COLUMN "reset_password_expires" TIMESTAMP
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_usuarios_reset_password_token" ON "usuarios" ("reset_password_token")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_usuarios_reset_password_token"`);
    await queryRunner.query(`
      ALTER TABLE "usuarios"
      DROP COLUMN "reset_password_token",
      DROP COLUMN "reset_password_expires"
    `);
  }
}
