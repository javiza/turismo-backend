import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * FinanzasService.resumen() agrupa por "estado" en cada carga del panel
 * de Finanzas, e ingresosMensuales()/topPaquetes()/topDestinos() filtran
 * y agrupan por "estado" y "fecha_reserva" — sin índice, cada una de esas
 * queries hacía un seq scan completo sobre "reservas" (tabla que solo va
 * a crecer). Esto explica buena parte de la lentitud reportada en el
 * panel admin, sobre todo en Finanzas, que dispara 6 queries en paralelo
 * al cargar la página.
 */
export class AddIndicesPerformanceReservas1784600200000
  implements MigrationInterface
{
  name = 'AddIndicesPerformanceReservas1784600200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX "idx_reservas_estado" ON "reservas" ("estado")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_reservas_fecha_reserva" ON "reservas" ("fecha_reserva")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_reservas_paquete_id_estado" ON "reservas" ("paquete_id", "estado")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_reservas_paquete_id_estado"`);
    await queryRunner.query(`DROP INDEX "idx_reservas_fecha_reserva"`);
    await queryRunner.query(`DROP INDEX "idx_reservas_estado"`);
  }
}
