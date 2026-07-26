import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { CacheService } from './cache.service';
import { REDIS_CLIENT } from './redis.constants';

/**
 * Módulo global de Redis.
 *
 * Expone UNA sola conexión ioredis (REDIS_CLIENT) que se reutiliza tanto
 * para caché (CacheService) como para BullMQ (QueueModule), en vez de abrir
 * una conexión por consumidor. Es @Global porque prácticamente todos los
 * módulos de negocio terminan necesitando CacheService.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('REDIS_URL');

        // maxRetriesPerRequest: null es requerido por BullMQ para las
        // conexiones que usa como blocking connection.
        const client = url
          ? new Redis(url, { maxRetriesPerRequest: null })
          : new Redis({
              host: config.get<string>('REDIS_HOST') ?? 'localhost',
              port: Number(config.get<string>('REDIS_PORT') ?? 6379),
              password: config.get<string>('REDIS_PASSWORD') || undefined,
              maxRetriesPerRequest: null,
            });

        client.on('error', (err) => {
          // No tumbamos el proceso: la app debe seguir funcionando (sin
          // caché ni colas) si Redis se cae momentáneamente.
          // eslint-disable-next-line no-console
          console.error('[Redis] error de conexión:', err.message);
        });

        return client;
      },
    },
    CacheService,
  ],
  exports: [REDIS_CLIENT, CacheService],
})
export class RedisModule {}
