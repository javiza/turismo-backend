"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFechasServicioADestinos1786200000000 = void 0;
class AddFechasServicioADestinos1786200000000 {
    name = 'AddFechasServicioADestinos1786200000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "destinos"
      ADD COLUMN "fecha_inicio" date NULL,
      ADD COLUMN "fecha_fin" date NULL
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "destinos"
      DROP COLUMN "fecha_inicio",
      DROP COLUMN "fecha_fin"
    `);
    }
}
exports.AddFechasServicioADestinos1786200000000 = AddFechasServicioADestinos1786200000000;
//# sourceMappingURL=1786200000000-AddFechasServicioADestinos.js.map