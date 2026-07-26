import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Agrega a contenido_home la URL del logo de la agencia. Es nullable
 * porque no todas las agencias tienen logo cargado desde el día uno (la
 * home cae de vuelta al ícono genérico mientras tanto — ver
 * ContenidoController/Navbar). Se sube por dos vías desde el panel
 * admin: subiendo un archivo (va a Cloudinary vía UploadsController,
 * carpeta "contenido") o pegando una URL externa directamente; en ambos
 * casos el resultado es simplemente esta columna de texto con la URL
 * final.
 */
export class AddLogoUrlAContenidoHome1784700000000
  implements MigrationInterface
{
  name = 'AddLogoUrlAContenidoHome1784700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contenido_home"
      ADD COLUMN "logo_url" text
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contenido_home"
      DROP COLUMN "logo_url"
    `);
  }
}
