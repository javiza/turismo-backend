import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Agrega fecha_inicio y fecha_fin a destinos: el rango en que el destino
 * está disponible como servicio (igual concepto que ya existe en
 * paquetes). Nullable porque los destinos ya creados no tienen estos
 * datos cargados; el formulario de creación del panel admin los pide
 * como obligatorios de ahora en adelante (ver CreateDestinoDto).
 */
export class AddFechasServicioADestinos1786200000000 implements MigrationInterface {
  name = 'AddFechasServicioADestinos1786200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "destinos"
      ADD COLUMN "fecha_inicio" date NULL,
      ADD COLUMN "fecha_fin" date NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "destinos"
      DROP COLUMN "fecha_inicio",
      DROP COLUMN "fecha_fin"
    `);
  }
}
