import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Agrega a contenido_home:
 * - slogan_color: color (hex) con el que se pinta la frase del slogan
 *   que acompaña al logo (nombreAgencia en Navbar/Footer). Default al
 *   color "clay" que ya se usaba a fuego en el texto (ver navbar.tsx),
 *   para que instalaciones existentes no cambien de aspecto al migrar.
 * - telefono / correo / direccion: datos de contacto de la agencia que
 *   el admin carga desde el panel y que se muestran en el Footer
 *   público. Todos nullable: mientras no se configuren, el Footer
 *   simplemente no renderiza esa línea.
 */
export class AddSloganColorYContactoAContenidoHome1785100000000
  implements MigrationInterface
{
  name = 'AddSloganColorYContactoAContenidoHome1785100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contenido_home"
      ADD COLUMN "slogan_color" text NOT NULL DEFAULT '#c2410c',
      ADD COLUMN "telefono" text,
      ADD COLUMN "correo" text,
      ADD COLUMN "direccion" text
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contenido_home"
      DROP COLUMN "slogan_color",
      DROP COLUMN "telefono",
      DROP COLUMN "correo",
      DROP COLUMN "direccion"
    `);
  }
}
