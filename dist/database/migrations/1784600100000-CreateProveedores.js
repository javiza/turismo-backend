"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProveedores1784600100000 = void 0;
class CreateProveedores1784600100000 {
    name = 'CreateProveedores1784600100000';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "proveedores" (
        "id" SERIAL PRIMARY KEY,
        "nombre_negocio" varchar(150) NOT NULL,
        "rubro" varchar(150),
        "nombre_contacto" varchar(150) NOT NULL,
        "correo" varchar(150) NOT NULL,
        "telefono" varchar(50) NOT NULL,
        "direccion" varchar(200),
        "descripcion" text NOT NULL,
        "leido" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
        await queryRunner.query(`
      CREATE INDEX "idx_proveedores_leido" ON "proveedores" ("leido")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "idx_proveedores_leido"`);
        await queryRunner.query(`DROP TABLE "proveedores"`);
    }
}
exports.CreateProveedores1784600100000 = CreateProveedores1784600100000;
//# sourceMappingURL=1784600100000-CreateProveedores.js.map