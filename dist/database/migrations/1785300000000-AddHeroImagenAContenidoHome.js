"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddHeroImagenAContenidoHome1785300000000 = void 0;
class AddHeroImagenAContenidoHome1785300000000 {
    name = 'AddHeroImagenAContenidoHome1785300000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "contenido_home"
      ADD COLUMN "hero_imagen_url" text,
      ADD COLUMN "hero_imagen_pos_x" double precision NOT NULL DEFAULT 50,
      ADD COLUMN "hero_imagen_pos_y" double precision NOT NULL DEFAULT 50,
      ADD COLUMN "hero_imagen_zoom" double precision NOT NULL DEFAULT 100
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "contenido_home"
      DROP COLUMN "hero_imagen_url",
      DROP COLUMN "hero_imagen_pos_x",
      DROP COLUMN "hero_imagen_pos_y",
      DROP COLUMN "hero_imagen_zoom"
    `);
    }
}
exports.AddHeroImagenAContenidoHome1785300000000 = AddHeroImagenAContenidoHome1785300000000;
//# sourceMappingURL=1785300000000-AddHeroImagenAContenidoHome.js.map