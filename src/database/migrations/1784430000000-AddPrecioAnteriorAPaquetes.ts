import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Agrega "precio_anterior" a paquetes: cuando el admin baja el precio de
 * un paquete, PaquetesService.update() guarda acá el precio que tenía
 * antes, para que el frontend pueda mostrar el precio viejo tachado y el
 * nuevo destacado (como hacen las agencias de viaje comerciales). No es
 * un campo de solo-lectura: el admin puede limpiarlo a mano (por ejemplo
 * si ya pasó mucho tiempo y no quiere seguir mostrando la rebaja).
 *
 * A propósito NO se toca acá nada de auditoría: los cambios de precio ya
 * quedan registrados en la tabla "auditoria" (ver auditoria.subscriber.ts,
 * que audita todo UPDATE de Paquete con datos_anteriores/datos_nuevos).
 * precio_anterior es solo para la vitrina pública, no reemplaza esa
 * bitácora.
 */
export class AddPrecioAnteriorAPaquetes1784430000000
  implements MigrationInterface
{
  name = 'AddPrecioAnteriorAPaquetes1784430000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "paquetes"
      ADD COLUMN "precio_anterior" numeric(12,2) NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "paquetes"
      DROP COLUMN "precio_anterior"
    `);
  }
}
