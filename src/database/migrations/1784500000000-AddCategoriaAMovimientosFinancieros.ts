import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Agrega "categoria" a movimientos_financieros para poder desglosar los
 * gastos (EGRESO_MANUAL) por rubro (sueldos, marketing, proveedores,
 * etc.) en vez de tener un solo monto agregado. Nullable porque solo
 * aplica a egresos; el resto de los tipos de movimiento queda en null.
 */
export class AddCategoriaAMovimientosFinancieros1784500000000
  implements MigrationInterface
{
  name = 'AddCategoriaAMovimientosFinancieros1784500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "movimientos_financieros"
      ADD COLUMN "categoria" varchar(30) NULL
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_movimientos_financieros_categoria"
      ON "movimientos_financieros" ("categoria")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "idx_movimientos_financieros_categoria"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movimientos_financieros" DROP COLUMN "categoria"`,
    );
  }
}
