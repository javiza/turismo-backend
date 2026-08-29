"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTituloYResenasAContenidoHome1784258800153 = void 0;
class AddTituloYResenasAContenidoHome1784258800153 {
    name = 'AddTituloYResenasAContenidoHome1784258800153';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "contenido_home"
      ADD COLUMN "titulo" text NOT NULL DEFAULT 'Programa tus vacaciones con nosotros',
      ADD COLUMN "resenas" jsonb NOT NULL DEFAULT '[]'::jsonb
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "contenido_home"
      DROP COLUMN "titulo",
      DROP COLUMN "resenas"
    `);
    }
}
exports.AddTituloYResenasAContenidoHome1784258800153 = AddTituloYResenasAContenidoHome1784258800153;
//# sourceMappingURL=1784258800153-AddTituloYResenasAContenidoHome.js.map