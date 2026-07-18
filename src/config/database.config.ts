import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Antes de este cambio esta configuración estaba duplicada: existía acá
 * (sin usarse en ningún lado) y otra vez, copiada a mano, dentro del
 * `useFactory` de `TypeOrmModule.forRootAsync` en app.module.ts. Ahora hay
 * una sola fuente de verdad para la conexión a la base de datos.
 */
export const getDatabaseConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.getOrThrow<string>('DB_HOST'),
  port: Number(config.get<number>('DB_PORT')),
  username: config.getOrThrow<string>('DB_USER'),
  password: config.getOrThrow<string>('DB_PASSWORD'),
database: config.getOrThrow<string>('DB_NAME'),
  autoLoadEntities: true,
  // NUNCA true en este proyecto: los cambios de esquema van por
  // migraciones (npm run migration:run), no por auto-sync. Fue justamente
  // saltarse una migración lo que causó el error original de login.
  synchronize: false,
  // Apagado siempre: con logging:true, TypeORM imprime cada query CON sus
  // parámetros (incluyendo password hashes, refresh tokens, etc., como se
  // vio en consola durante el login). Si en algún momento se necesita
  // depurar queries puntuales, usar logging: ['error', 'warn'] (nunca
  // 'query'/'query'+params) o activarlo temporalmente y a mano, jamás
  // dejarlo prendido por NODE_ENV.
  logging: false,
  ssl:
    config.get<string>('NODE_ENV') === 'production'
      ? { rejectUnauthorized: false }
      : false,
});
