import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Tabla "singleton" (siempre una sola fila, id = 1) con la configuración
 * financiera editable desde el panel admin. Por ahora solo tiene el
 * porcentaje de impuesto (IVA) que se usa para calcular "Impuestos" en
 * el resumen de Finanzas — se guarda en base de datos (no en .env)
 * justamente porque la normativa chilena lo sube de tanto en tanto y un
 * SUPER_ADMIN/ADMIN debe poder editarlo sin necesitar un redeploy.
 *
 * Valor por defecto 19.00: tasa general de IVA vigente en Chile al
 * momento de esta migración. Editable desde
 * PATCH /finanzas/configuracion.
 */
export class CreateConfiguracionFinanciera1784600000000
  implements MigrationInterface
{
  name = 'CreateConfiguracionFinanciera1784600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "configuracion_financiera" (
        "id" integer PRIMARY KEY DEFAULT 1,
        "porcentaje_impuesto" numeric(5,2) NOT NULL DEFAULT 19.00,
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "CK_configuracion_financiera_singleton" CHECK ("id" = 1),
        CONSTRAINT "CK_configuracion_financiera_porcentaje_valido"
          CHECK ("porcentaje_impuesto" >= 0 AND "porcentaje_impuesto" <= 100)
      )
    `);

    await queryRunner.query(`
      INSERT INTO "configuracion_financiera" ("id", "porcentaje_impuesto")
      VALUES (1, 19.00)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "configuracion_financiera"`);
  }
}
