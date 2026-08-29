"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateClientes1783892461295 = void 0;
class CreateClientes1783892461295 {
    name = 'CreateClientes1783892461295';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "clientes" (
        "id" SERIAL PRIMARY KEY,
        "nombre" character varying(150) NOT NULL,
        "email" character varying(150) NOT NULL,
        "password" character varying NOT NULL,
        "telefono" character varying(50),
        "activo" boolean NOT NULL DEFAULT true,
        "hashed_refresh_token" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_clientes_email" UNIQUE ("email")
      )
    `);
        await queryRunner.query(`
      ALTER TABLE "reservas" ADD COLUMN "cliente_id" integer
    `);
        await queryRunner.query(`
      ALTER TABLE "reservas"
      ADD CONSTRAINT "FK_reservas_cliente"
      FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id")
      ON DELETE SET NULL
    `);
        await queryRunner.query(`
      ALTER TABLE "cotizaciones" ADD COLUMN "cliente_id" integer
    `);
        await queryRunner.query(`
      ALTER TABLE "cotizaciones"
      ADD CONSTRAINT "FK_cotizaciones_cliente"
      FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id")
      ON DELETE SET NULL
    `);
        await queryRunner.query(`
      CREATE INDEX "IDX_reservas_cliente_id" ON "reservas" ("cliente_id")
    `);
        await queryRunner.query(`
      CREATE INDEX "IDX_cotizaciones_cliente_id" ON "cotizaciones" ("cliente_id")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."IDX_cotizaciones_cliente_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_reservas_cliente_id"`);
        await queryRunner.query(`ALTER TABLE "cotizaciones" DROP CONSTRAINT "FK_cotizaciones_cliente"`);
        await queryRunner.query(`ALTER TABLE "cotizaciones" DROP COLUMN "cliente_id"`);
        await queryRunner.query(`ALTER TABLE "reservas" DROP CONSTRAINT "FK_reservas_cliente"`);
        await queryRunner.query(`ALTER TABLE "reservas" DROP COLUMN "cliente_id"`);
        await queryRunner.query(`DROP TABLE "clientes"`);
    }
}
exports.CreateClientes1783892461295 = CreateClientes1783892461295;
//# sourceMappingURL=1783892461295-CreateClientes.js.map