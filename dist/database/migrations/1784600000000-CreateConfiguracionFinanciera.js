"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateConfiguracionFinanciera1784600000000 = void 0;
class CreateConfiguracionFinanciera1784600000000 {
    name = 'CreateConfiguracionFinanciera1784600000000';
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "configuracion_financiera"`);
    }
}
exports.CreateConfiguracionFinanciera1784600000000 = CreateConfiguracionFinanciera1784600000000;
//# sourceMappingURL=1784600000000-CreateConfiguracionFinanciera.js.map