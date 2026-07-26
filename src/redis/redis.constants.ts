/**
 * Token de inyección del cliente ioredis.
 *
 * Vive en su propio archivo (en vez de en redis.module.ts) para evitar
 * un import circular: cache.service.ts y redis.health.ts necesitan el
 * token, y redis.module.ts a su vez importa CacheService. Si el token
 * se declarara dentro de redis.module.ts, ese ciclo hace que
 * REDIS_CLIENT llegue como `undefined` en tiempo de ejecución al
 * decorador @Inject() de los archivos que lo consumen antes de que el
 * módulo termine de inicializarse.
 */
export const REDIS_CLIENT = 'REDIS_CLIENT';
