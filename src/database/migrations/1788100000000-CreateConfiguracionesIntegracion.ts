import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Guarda las credenciales de integraciones externas (SMTP, WhatsApp,
 * Transbank, Mercado Pago) configurables desde el panel admin, cifradas
 * con AES-256-GCM (ver common/utils/crypto.util.ts) — nunca en texto
 * plano. La llave de cifrado (CONFIG_ENCRYPTION_KEY) vive solo en el
 * .env del backend, nunca en esta tabla.
 */
export class CreateConfiguracionesIntegracion1788100000000 implements MigrationInterface {
  name = 'CreateConfiguracionesIntegracion1788100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "configuraciones_integracion"`);
    await queryRunner.query(`DROP TYPE "public"."configuraciones_integracion_clave_enum"`);
  }
}
