"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddContactosAdicionalesAClientes1786500000000 = void 0;
class AddContactosAdicionalesAClientes1786500000000 {
    name = 'AddContactosAdicionalesAClientes1786500000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "clientes"
      ADD COLUMN "telefonos_adicionales" jsonb NOT NULL DEFAULT '[]'::jsonb,
      ADD COLUMN "correos_adicionales" jsonb NOT NULL DEFAULT '[]'::jsonb
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "clientes"
      DROP COLUMN "telefonos_adicionales",
      DROP COLUMN "correos_adicionales"
    `);
    }
}
exports.AddContactosAdicionalesAClientes1786500000000 = AddContactosAdicionalesAClientes1786500000000;
//# sourceMappingURL=1786500000000-AddContactosAdicionalesAClientes.js.map