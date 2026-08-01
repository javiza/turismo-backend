import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Agrega el RUT chileno a clientes: nullable porque el registro público
 * no lo pide (ver RegistroClienteDto) — se completa después desde el
 * panel admin (PATCH /clientes/:id) o el propio cliente desde su
 * perfil. Sin UNIQUE a propósito: dos cuentas distintas podrían
 * necesitar el mismo RUT cargado por error hasta que se corrija a
 * mano, y no queremos que un constraint bloquee el guardado del resto
 * de los datos del cliente.
 */
export class AddRutAClientes1785400000000 implements MigrationInterface {
  name = 'AddRutAClientes1785400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "clientes"
      ADD COLUMN "rut" varchar(20)
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_clientes_rut" ON "clientes" ("rut")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_clientes_rut"`);
    await queryRunner.query(`
      ALTER TABLE "clientes"
      DROP COLUMN "rut"
    `);
  }
}
