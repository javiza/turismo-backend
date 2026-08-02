import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Agrega "precio_desde" a destinos: precio referencial que el admin
 * ingresa a mano (ej. "Desde $120.000"), independiente del precio de
 * los paquetes asociados. Nullable: un destino puede no tener precio
 * cargado todavía y simplemente no se muestra en la vitrina.
 */
export class AddPrecioDesdeADestinos1786000000000
  implements MigrationInterface
{
  name = 'AddPrecioDesdeADestinos1786000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "destinos"
      ADD COLUMN "precio_desde" numeric(12,2)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "destinos"
      DROP COLUMN "precio_desde"
    `);
  }
}
