import { HealthIndicatorService } from '@nestjs/terminus';
import Redis from 'ioredis';
export declare class RedisHealthIndicator {
    private readonly redis;
    private readonly healthIndicatorService;
    constructor(redis: Redis, healthIndicatorService: HealthIndicatorService);
    pingCheck(key: string): Promise<import("@nestjs/terminus").HealthIndicatorResult<string, "up", {
        [x: string]: unknown;
    }> | import("@nestjs/terminus").HealthIndicatorResult<string, "down", {
        message: string;
    }>>;
}
