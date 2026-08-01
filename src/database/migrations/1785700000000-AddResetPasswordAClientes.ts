import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Soporte para "olvidé mi contraseña" (clientes). Igual que con
 * hashedRefreshToken, el token de reseteo se guarda hasheado (SHA-256,
 * ver common/utils/token-hash.ts) y no en texto plano — el valor que se
 * envía por correo es el token crudo, nunca se persiste así. La
 * expiración vive en su propia columna para poder invalidar el token
 * pasado un tiempo corto sin depender de comparar contra "ahora - X" en
 * cada query.
 */
export class AddResetPasswordAClientes1785700000000 implements MigrationInterface {
  name = 'AddResetPasswordAClientes1785700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "clientes"
      ADD COLUMN "reset_password_token" varchar(255),
      ADD COLUMN "reset_password_expires" TIMESTAMP
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_clientes_reset_password_token" ON "clientes" ("reset_password_token")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_clientes_reset_password_token"`);
    await queryRunner.query(`
      ALTER TABLE "clientes"
      DROP COLUMN "reset_password_token",
      DROP COLUMN "reset_password_expires"
    `);
  }
}
