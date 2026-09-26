import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Antes, el <title> de la pestaña del navegador se armaba siempre como
 * `${nombreAgencia} | Agencia de Turismo` (ver generateMetadata() en el
 * frontend), reutilizando el mismo texto que se muestra junto al logo
 * (nombre_agencia). El admin pidió poder separar ambos: la frase junto
 * al logo (nombre_agencia, sección Portada) y el título de la pestaña
 * (titulo_pestana, sección Favicon) ahora son independientes.
 *
 * titulo_pestana nullable/"" = el frontend cae de vuelta al comportamiento
 * anterior (usa nombre_agencia + " | Agencia de Turismo"), así que esta
 * migración no cambia el aspecto de sitios ya en producción hasta que el
 * admin cargue un valor propio.
 */
export class AddTituloPestanaAContenidoHome1788300000000
  implements MigrationInterface
{
  name = 'AddTituloPestanaAContenidoHome1788300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contenido_home"
      ADD COLUMN "titulo_pestana" text
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contenido_home"
      DROP COLUMN "titulo_pestana"
    `);
  }
}
