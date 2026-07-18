import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConsultasEmail1783872261563 implements MigrationInterface {
  name = 'CreateConsultasEmail1783872261563';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."consultas_email_estado_enum" AS ENUM (
        'RESPONDIDA_IA', 'ESCALADA', 'ERROR'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "consultas_email" (
        "id" SERIAL PRIMARY KEY,
        "gmail_message_id" character varying(100) NOT NULL,
        "gmail_thread_id" character varying(100) NOT NULL,
        "remitente" character varying(200) NOT NULL,
        "asunto" character varying(250),
        "cuerpo_original" text NOT NULL,
        "respuesta" text,
        "estado" "public"."consultas_email_estado_enum" NOT NULL,
        "detalle" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_consultas_email_gmail_message_id" UNIQUE ("gmail_message_id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_consultas_email_estado" ON "consultas_email" ("estado")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_consultas_email_estado"`);
    await queryRunner.query(`DROP TABLE "consultas_email"`);
    await queryRunner.query(`DROP TYPE "public"."consultas_email_estado_enum"`);
  }
}
