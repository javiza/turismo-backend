"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSloganColorYContactoAContenidoHome1785100000000 = void 0;
class AddSloganColorYContactoAContenidoHome1785100000000 {
    name = 'AddSloganColorYContactoAContenidoHome1785100000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "contenido_home"
      ADD COLUMN "slogan_color" text NOT NULL DEFAULT '#c2410c',
      ADD COLUMN "telefono" text,
      ADD COLUMN "correo" text,
      ADD COLUMN "direccion" text
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "contenido_home"
      DROP COLUMN "slogan_color",
      DROP COLUMN "telefono",
      DROP COLUMN "correo",
      DROP COLUMN "direccion"
    `);
    }
}
exports.AddSloganColorYContactoAContenidoHome1785100000000 = AddSloganColorYContactoAContenidoHome1785100000000;
//# sourceMappingURL=1785100000000-AddSloganColorYContactoAContenidoHome.js.map