import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Agrega el detalle de "quién pagó" a los movimientos financieros
 * (hoy solo se cargan a mano vía INGRESO_MANUAL; a futuro esto se
 * podría llenar automáticamente desde una pasarela de pago real):
 * - cliente_id: vínculo opcional a un cliente con cuenta registrada.
 * - pagador_nombre: nombre libre, para pagos de alguien sin cuenta
 *   (ej. efectivo recibido de un pasajero que no se registró).
 * - metodo_pago: EFECTIVO/TRANSFERENCIA/TARJETA/WEBPAY/OTRO.
 */
export class AddDetallePagoAMovimientosFinancieros1785600000000
  implements MigrationInterface
{
  name = 'AddDetallePagoAMovimientosFinancieros1785600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "movimientos_financieros"
      ADD COLUMN "cliente_id" integer,
      ADD COLUMN "pagador_nombre" varchar(150),
      ADD COLUMN "metodo_pago" varchar(30)
    `);

    await queryRunner.query(`
      ALTER TABLE "movimientos_financieros"
      ADD CONSTRAINT "fk_movimientos_financieros_cliente"
      FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_movimientos_financieros_cliente_id"
      ON "movimientos_financieros" ("cliente_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_movimientos_financieros_cliente_id"`);
    await queryRunner.query(`
      ALTER TABLE "movimientos_financieros"
      DROP CONSTRAINT "fk_movimientos_financieros_cliente"
    `);
    await queryRunner.query(`
      ALTER TABLE "movimientos_financieros"
      DROP COLUMN "cliente_id",
      DROP COLUMN "pagador_nombre",
      DROP COLUMN "metodo_pago"
    `);
  }
}
