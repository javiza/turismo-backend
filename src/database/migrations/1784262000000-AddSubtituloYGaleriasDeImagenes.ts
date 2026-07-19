import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Varios cambios relacionados, agrupados en una sola migración:
 *
 *  - contenido_home.subtitulo: la bajada del hero de la home (debajo del
 *    título grande), editable desde el panel admin junto al resto del
 *    contenido de la home.
 *
 *  - contenido_home.nombre_agencia: nombre comercial de la agencia,
 *    configurable desde el panel en vez de hardcodeado en el frontend.
 *    Permite reutilizar el mismo backend (y el mismo frontend, sin tocar
 *    código) para distintos clientes: cada uno pone su propio nombre desde
 *    su panel admin.
 *
 *  - destino_imagenes.es_principal: marca qué imagen de la galería de un
 *    destino es la "de perfil" (antes no había forma de elegirla desde la
 *    galería, solo se pisaba a mano el campo suelto imagen_principal).
 *
 *  - paquetes.imagen_principal + tabla paquete_imagenes: paquetes no
 *    tenía ningún soporte de imágenes. Ahora replica exactamente el mismo
 *    patrón que destinos (galería con selección de imagen de perfil).
 *
 *  - ofertas.imagen_principal + tabla oferta_imagenes: mismo caso que
 *    paquetes.
 */
export class AddSubtituloYGaleriasDeImagenes1784262000000
  implements MigrationInterface
{
  name = 'AddSubtituloYGaleriasDeImagenes1784262000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "contenido_home"
      ADD COLUMN "subtitulo" text NOT NULL DEFAULT '',
      ADD COLUMN "nombre_agencia" text NOT NULL DEFAULT 'Tu Agencia de Viajes'
    `);

    await queryRunner.query(`
      ALTER TABLE "destino_imagenes"
      ADD COLUMN "es_principal" boolean NOT NULL DEFAULT false
    `);

    // Si ya había una imagen_principal seteada a mano en destinos, marcamos
    // como principal la fila de la galería que tenga esa misma url (si
    // existe), para no perder la elección previa.
    await queryRunner.query(`
      UPDATE "destino_imagenes" di
      SET "es_principal" = true
      FROM "destinos" d
      WHERE di.destino_id = d.id
        AND d.imagen_principal IS NOT NULL
        AND di.url = d.imagen_principal
    `);

    await queryRunner.query(`
      ALTER TABLE "paquetes"
      ADD COLUMN "imagen_principal" text
    `);

    await queryRunner.query(`
      CREATE TABLE "paquete_imagenes" (
        "id" BIGSERIAL PRIMARY KEY,
        "paquete_id" BIGINT NOT NULL REFERENCES "paquetes"(id) ON DELETE CASCADE,
        "url" text NOT NULL,
        "es_principal" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "ofertas"
      ADD COLUMN "imagen_principal" text
    `);

    await queryRunner.query(`
      CREATE TABLE "oferta_imagenes" (
        "id" BIGSERIAL PRIMARY KEY,
        "oferta_id" BIGINT NOT NULL REFERENCES "ofertas"(id) ON DELETE CASCADE,
        "url" text NOT NULL,
        "es_principal" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "oferta_imagenes"`);
    await queryRunner.query(`ALTER TABLE "ofertas" DROP COLUMN "imagen_principal"`);

    await queryRunner.query(`DROP TABLE "paquete_imagenes"`);
    await queryRunner.query(`ALTER TABLE "paquetes" DROP COLUMN "imagen_principal"`);

    await queryRunner.query(
      `ALTER TABLE "destino_imagenes" DROP COLUMN "es_principal"`,
    );

    await queryRunner.query(
      `ALTER TABLE "contenido_home" DROP COLUMN "subtitulo", DROP COLUMN "nombre_agencia"`,
    );
  }
}
