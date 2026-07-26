import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

import { RedisHealthIndicator } from './redis.health';

/**
 * Endpoints de salud, pensados para el healthcheck del proveedor cloud
 * (Railway/Render arrancan/reinician el contenedor según esto) y para
 * un panel de monitoreo externo (UptimeRobot, Better Stack, etc.).
 *
 * - GET /health         -> chequeo completo (DB + Redis + memoria + disco).
 * - GET /health/liveness  -> el proceso está vivo (no depende de servicios
 *   externos). Úsalo como "liveness probe" si migras a k8s/similar.
 * - GET /health/readiness -> el proceso puede recibir tráfico (DB y Redis
 *   arriba). Úsalo como "readiness probe".
 */
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly redis: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database', { timeout: 3000 }),
      () => this.redis.pingCheck('redis'),
      // Heap > 300MB o RSS > 500MB: probablemente hay un leak, mejor
      // reiniciar antes de que el contenedor se quede sin memoria.
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 500 * 1024 * 1024),
      () =>
        this.disk.checkStorage('disk', {
          path: '/',
          thresholdPercent: 0.9,
        }),
    ]);
  }

  @Get('liveness')
  @HealthCheck()
  liveness() {
    return this.health.check([]);
  }

  @Get('readiness')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.db.pingCheck('database', { timeout: 3000 }),
      () => this.redis.pingCheck('redis'),
    ]);
  }
}
