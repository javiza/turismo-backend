import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Movimientos financieros manuales: dinero que el admin registra a mano
 * (no viene de una reserva). Separado a propósito de "reservas" para que
 * un robo, estafa o pérdida NUNCA se mezcle con los ingresos reales de
 * ventas — FinanzasService los suma en columnas propias, nunca dentro de
 * ingresosConfirmados.
 */
export class CreateMovimientosFinancieros1784430100000
  implements MigrationInterface
{
  name = 'CreateMovimientosFinancieros1784430100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "movimientos_financieros" (
        "id" SERIAL PRIMARY KEY,
        "tipo" varchar(30) NOT NULL,
        "monto" numeric(12,2) NOT NULL,
        "descripcion" text NOT NULL,
        "usuario_id" bigint NULL REFERENCES "usuarios"("id") ON DELETE SET NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_movimientos_financieros_tipo"
      ON "movimientos_financieros" ("tipo")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "movimientos_financieros"`);
  }
}
