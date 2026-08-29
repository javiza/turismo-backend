import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Integración de pago con tarjeta vía Transbank Webpay Plus.
 *
 * - reservas.metodo_pago / reservas.pagado_en: se llenan solos cuando el
 *   pago Webpay queda AUTORIZADO (ver PagosService.confirmar()) — hasta
 *   entonces quedan null, igual que hoy. Reutiliza el mismo enum
 *   MetodoPago que ya existía para los movimientos financieros manuales
 *   (EFECTIVO/TRANSFERENCIA/TARJETA/WEBPAY/OTRO), así el dato es
 *   consistente entre ambas tablas.
 * - pagos_webpay: registro completo (1 fila por intento de pago) de cada
 *   transacción Webpay para poder auditar/depurar — token, buy_order,
 *   estado, código de autorización, etc. Una reserva puede tener más de
 *   un intento (ej. si el primero fue rechazado y el cliente reintenta).
 */
export class CreatePagosWebpay1786600000000 implements MigrationInterface {
  name = 'CreatePagosWebpay1786600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "reservas"
      ADD COLUMN "metodo_pago" varchar(30),
      ADD COLUMN "pagado_en" timestamptz
    `);

    await queryRunner.query(`
      CREATE TABLE "pagos_webpay" (
        "id" SERIAL PRIMARY KEY,
        "reserva_id" integer NOT NULL,
        "buy_order" varchar(26) NOT NULL,
        "session_id" varchar(61) NOT NULL,
        "token" varchar(64),
        "monto" numeric(12,2) NOT NULL,
        "estado" varchar(20) NOT NULL DEFAULT 'INICIADO',
        "codigo_autorizacion" varchar(20),
        "codigo_respuesta" integer,
        "tipo_pago" varchar(5),
        "cuotas" integer,
        "ultimos_digitos_tarjeta" varchar(4),
        "fecha_transaccion" timestamptz,
        "respuesta_cruda" jsonb,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "fk_pagos_webpay_reserva" FOREIGN KEY ("reserva_id")
          REFERENCES "reservas"("id") ON DELETE CASCADE,
        CONSTRAINT "uq_pagos_webpay_buy_order" UNIQUE ("buy_order")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_pagos_webpay_reserva_id" ON "pagos_webpay" ("reserva_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_pagos_webpay_token" ON "pagos_webpay" ("token")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_pagos_webpay_token"`);
    await queryRunner.query(`DROP INDEX "idx_pagos_webpay_reserva_id"`);
    await queryRunner.query(`DROP TABLE "pagos_webpay"`);
    await queryRunner.query(`
      ALTER TABLE "reservas"
      DROP COLUMN "metodo_pago",
      DROP COLUMN "pagado_en"
    `);
  }
}
