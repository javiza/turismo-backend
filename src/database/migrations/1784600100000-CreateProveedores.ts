import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Tabla "proveedores": mapea el formulario público "Contacto proveedores"
 * (home -> /proveedores). Un negocio o posible proveedor deja sus datos
 * para que la agencia lo contacte después. Al crearse, se notifica al
 * admin por correo y por WhatsApp (ver ProveedoresService), y queda
 * disponible en el panel admin (/dashboard/admin/proveedores), igual que
 * "mensajes" con su columna "leido".
 */
export class CreateProveedores1784600100000 implements MigrationInterface {
  name = 'CreateProveedores1784600100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_proveedores_leido"`);
    await queryRunner.query(`DROP TABLE "proveedores"`);
  }
}
