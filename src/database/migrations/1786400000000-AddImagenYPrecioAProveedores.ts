import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Agrega imagen y precio referencial (ambos opcionales) al formulario
 * público "Contacto proveedores": el negocio que se registra puede
 * dejar una foto y un precio aproximado para que el admin se haga una
 * idea antes de contactarlo. Ver ProveedoresController.subirImagen()
 * para la subida (Cloudinary) y CreateProveedorDto para la validación.
 */
export class AddImagenYPrecioAProveedores1786400000000 implements MigrationInterface {
  name = 'AddImagenYPrecioAProveedores1786400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "proveedores"
      ADD COLUMN "imagen_url" text
    `);
    await queryRunner.query(`
      ALTER TABLE "proveedores"
      ADD COLUMN "precio_referencial" numeric(12,2)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
