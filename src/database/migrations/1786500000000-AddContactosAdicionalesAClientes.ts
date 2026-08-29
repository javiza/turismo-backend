import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Permite que un cliente registre más de un teléfono y más de un correo
 * de contacto, además de los principales (`telefono` y `email`, este
 * último sigue siendo el único que sirve para iniciar sesión y no se
 * puede editar). Se guardan como arreglos jsonb simples (["+56...", ...])
 * en vez de una tabla relacionada aparte: no necesitan más metadata
 * (tipo, etiqueta, verificación) por ahora, así que una tabla nueva sería
 * sobre-ingeniería para el caso de uso actual.
 */
export class AddContactosAdicionalesAClientes1786500000000
  implements MigrationInterface
{
  name = 'AddContactosAdicionalesAClientes1786500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "clientes"
      ADD COLUMN "telefonos_adicionales" jsonb NOT NULL DEFAULT '[]'::jsonb,
      ADD COLUMN "correos_adicionales" jsonb NOT NULL DEFAULT '[]'::jsonb
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "clientes"
      DROP COLUMN "telefonos_adicionales",
      DROP COLUMN "correos_adicionales"
    `);
  }
}
