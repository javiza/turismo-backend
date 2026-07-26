import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import Redis from 'ioredis';

import { REDIS_CLIENT } from '../redis/redis.constants';

@Injectable()
export class RedisHealthIndicator {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async pingCheck(key: string) {
    const indicator = this.healthIndicatorService.check(key);

    try {
      const pong = await this.redis.ping();
      if (pong !== 'PONG') {
        throw new Error(`Respuesta inesperada de Redis: ${pong}`);
      }
      return indicator.up();
    } catch (error) {
      return indicator.down({ message: (error as Error).message });
    }
  }
}
