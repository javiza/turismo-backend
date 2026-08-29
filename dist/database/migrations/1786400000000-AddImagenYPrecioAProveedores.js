"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddImagenYPrecioAProveedores1786400000000 = void 0;
class AddImagenYPrecioAProveedores1786400000000 {
    name = 'AddImagenYPrecioAProveedores1786400000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "proveedores"
      ADD COLUMN "imagen_url" text
    `);
        await queryRunner.query(`
      ALTER TABLE "proveedores"
      ADD COLUMN "precio_referencial" numeric(12,2)
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "proveedores"
      DROP COLUMN "precio_referencial"
    `);
        await queryRunner.query(`
      ALTER TABLE "proveedores"
      DROP COLUMN "imagen_url"
    `);
    }
}
exports.AddImagenYPrecioAProveedores1786400000000 = AddImagenYPrecioAProveedores1786400000000;
//# sourceMappingURL=1786400000000-AddImagenYPrecioAProveedores.js.map