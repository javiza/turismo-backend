import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

import { REDIS_CLIENT } from './redis.constants';

/**
 * Caché de aplicación sobre Redis.
 *
 * Se implementó a mano sobre ioredis (en vez de @nestjs/cache-manager) para
 * tener control total sobre serialización, invalidación por prefijo/patrón
 * y para reutilizar la misma conexión que usa BullMQ. Cualquier falla de
 * Redis se traga y se loguea: el caché es una optimización, nunca debe
 * romper una request.
 */
@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await this.redis.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (error) {
      this.logger.warn(`No se pudo leer caché "${key}": ${(error as Error).message}`);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (error) {
      this.logger.warn(`No se pudo escribir caché "${key}": ${(error as Error).message}`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.warn(`No se pudo borrar caché "${key}": ${(error as Error).message}`);
    }
  }

  /**
   * Borra todas las claves que empiecen con `prefix`. Se usa para invalidar
   * un listado completo (ej. "destinos:list:*") cuando algo cambia.
   * Usa SCAN en vez de KEYS para no bloquear Redis con datasets grandes.
   */
  async delByPrefix(prefix: string): Promise<void> {
    try {
      const stream = this.redis.scanStream({ match: `${prefix}*`, count: 100 });
      const pipeline = this.redis.pipeline();
      let found = false;

      for await (const keys of stream) {
        if (keys.length) {
          found = true;
          keys.forEach((key: string) => pipeline.del(key));
        }
      }

      if (found) {
        await pipeline.exec();
      }
    } catch (error) {
      this.logger.warn(
        `No se pudo invalidar caché con prefijo "${prefix}": ${(error as Error).message}`,
      );
    }
  }

  /**
   * Patrón "cache-aside": intenta leer, si no hay valor ejecuta `loader`,
   * guarda el resultado y lo devuelve. Es el método que van a usar la
   * mayoría de los servicios.
   */
  async wrap<T>(key: string, ttlSeconds: number, loader: () => Promise<T>): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const fresh = await loader();
    await this.set(key, fresh, ttlSeconds);
    return fresh;
  }
}
