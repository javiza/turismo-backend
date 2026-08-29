"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRespuestaACotizaciones1784421103810 = void 0;
class AddRespuestaACotizaciones1784421103810 {
    name = 'AddRespuestaACotizaciones1784421103810';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "cotizaciones"
      ADD COLUMN "respuesta" text NULL,
      ADD COLUMN "respondido_en" TIMESTAMP NULL,
      ADD COLUMN "leida" boolean NOT NULL DEFAULT false
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "cotizaciones"
      DROP COLUMN "respuesta",
      DROP COLUMN "respondido_en",
      DROP COLUMN "leida"
    `);
    }
}
exports.AddRespuestaACotizaciones1784421103810 = AddRespuestaACotizaciones1784421103810;
//# sourceMappingURL=1784421103810-AddRespuestaACotizaciones.js.map