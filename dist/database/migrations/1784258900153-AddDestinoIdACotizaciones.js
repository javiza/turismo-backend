"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDestinoIdACotizaciones1784258900153 = void 0;
class AddDestinoIdACotizaciones1784258900153 {
    name = 'AddDestinoIdACotizaciones1784258900153';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "cotizaciones"
      ADD COLUMN "destino_id" integer NULL,
      ADD CONSTRAINT "FK_cotizaciones_destino"
        FOREIGN KEY ("destino_id") REFERENCES "destinos" ("id")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "cotizaciones"
      DROP CONSTRAINT "FK_cotizaciones_destino",
      DROP COLUMN "destino_id"
    `);
    }
}
exports.AddDestinoIdACotizaciones1784258900153 = AddDestinoIdACotizaciones1784258900153;
//# sourceMappingURL=1784258900153-AddDestinoIdACotizaciones.js.map