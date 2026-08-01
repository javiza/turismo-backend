import { MigrationInterface, QueryRunner } from 'typeorm';

/** Mismo criterio que AddRutAClientes: RUT opcional para poder buscar/identificar cuentas de staff, sin UNIQUE constraint. */
export class AddRutAUsuarios1785500000000 implements MigrationInterface {
  name = 'AddRutAUsuarios1785500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "usuarios"
      ADD COLUMN "rut" varchar(20)
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_usuarios_rut" ON "usuarios" ("rut")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_usuarios_rut"`);
    await queryRunner.query(`
      ALTER TABLE "usuarios"
      DROP COLUMN "rut"
    `);
  }
}
