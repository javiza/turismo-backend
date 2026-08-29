"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePagosWebpay1786600000000 = void 0;
class CreatePagosWebpay1786600000000 {
    name = 'CreatePagosWebpay1786600000000';
    async up(queryRunner) {
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
    async down(queryRunner) {
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
exports.CreatePagosWebpay1786600000000 = CreatePagosWebpay1786600000000;
//# sourceMappingURL=1786600000000-CreatePagosWebpay.js.map