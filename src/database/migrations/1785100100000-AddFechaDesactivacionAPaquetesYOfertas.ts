import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Agrega "fecha_desactivacion" a paquetes y ofertas: se completa cuando
 * el admin desactiva el servicio (activo/activa -> false) y se limpia
 * si vuelve a activarlo. TasksScheduler la usa para el borrado
 * definitivo automático de servicios que llevan 6 meses desactivados
 * (ver queue/tasks.scheduler.ts y PaquetesService/OfertasService).
 *
 * No se completa retroactivamente para filas ya desactivadas antes de
 * esta migración (quedan en NULL, es decir, nunca se autoborran solas
 * hasta que el admin las toque de nuevo) para no borrar de sorpresa
 * datos desactivados hace tiempo sin aviso previo.
 */
export class AddFechaDesactivacionAPaquetesYOfertas1785100100000
  implements MigrationInterface
{
  name = 'AddFechaDesactivacionAPaquetesYOfertas1785100100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "paquetes"
      ADD COLUMN "fecha_desactivacion" timestamp
    `);
    await queryRunner.query(`
      ALTER TABLE "ofertas"
      ADD COLUMN "fecha_desactivacion" timestamp
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "paquetes"
      DROP COLUMN "fecha_desactivacion"
    `);
    await queryRunner.query(`
      ALTER TABLE "ofertas"
      DROP COLUMN "fecha_desactivacion"
    `);
  }
}
