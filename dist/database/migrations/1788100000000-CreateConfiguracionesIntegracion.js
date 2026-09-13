"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateConfiguracionesIntegracion1788100000000 = void 0;
class CreateConfiguracionesIntegracion1788100000000 {
    name = 'CreateConfiguracionesIntegracion1788100000000';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TYPE "public"."configuraciones_integracion_clave_enum" AS ENUM ('smtp', 'whatsapp', 'transbank', 'mercadopago')
    `);
        await queryRunner.query(`
      CREATE TABLE "configuraciones_integracion" (
        "id" SERIAL PRIMARY KEY,
        "clave" "public"."configuraciones_integracion_clave_enum" NOT NULL,
        "valor_cifrado" text NOT NULL,
        "actualizado_por_id" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_configuraciones_integracion_clave" UNIQUE ("clave")
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "configuraciones_integracion"`);
        await queryRunner.query(`DROP TYPE "public"."configuraciones_integracion_clave_enum"`);
    }
}
exports.CreateConfiguracionesIntegracion1788100000000 = CreateConfiguracionesIntegracion1788100000000;
//# sourceMappingURL=1788100000000-CreateConfiguracionesIntegracion.js.map