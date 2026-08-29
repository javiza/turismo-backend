import { HealthCheckService, TypeOrmHealthIndicator, MemoryHealthIndicator, DiskHealthIndicator } from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis.health';
export declare class HealthController {
    private readonly health;
    private readonly db;
    private readonly memory;
    private readonly disk;
    private readonly redis;
    constructor(health: HealthCheckService, db: TypeOrmHealthIndicator, memory: MemoryHealthIndicator, disk: DiskHealthIndicator, redis: RedisHealthIndicator);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult<(import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & import("@nestjs/terminus").HealthIndicatorResult<"disk"> & import("@nestjs/terminus").HealthIndicatorResult<"memory_rss"> & import("@nestjs/terminus").HealthIndicatorResult<"memory_heap"> & (import("@nestjs/terminus").HealthIndicatorResult<string, "up", {
        [x: string]: unknown;
    }> | import("@nestjs/terminus").HealthIndicatorResult<string, "down", {
        message: string;
    }>)) & import("@nestjs/terminus").HealthIndicatorResult<"database">, Partial<(import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & import("@nestjs/terminus").HealthIndicatorResult<"disk"> & import("@nestjs/terminus").HealthIndicatorResult<"memory_rss"> & import("@nestjs/terminus").HealthIndicatorResult<"memory_heap"> & (import("@nestjs/terminus").HealthIndicatorResult<string, "up", {
        [x: string]: unknown;
    }> | import("@nestjs/terminus").HealthIndicatorResult<string, "down", {
        message: string;
    }>)) & import("@nestjs/terminus").HealthIndicatorResult<"database">> | undefined, Partial<(import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & import("@nestjs/terminus").HealthIndicatorResult<"disk"> & import("@nestjs/terminus").HealthIndicatorResult<"memory_rss"> & import("@nestjs/terminus").HealthIndicatorResult<"memory_heap"> & (import("@nestjs/terminus").HealthIndicatorResult<string, "up", {
        [x: string]: unknown;
    }> | import("@nestjs/terminus").HealthIndicatorResult<string, "down", {
        message: string;
    }>)) & import("@nestjs/terminus").HealthIndicatorResult<"database">> | undefined>>;
    liveness(): Promise<import("@nestjs/terminus").HealthCheckResult<import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>>, Partial<import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>>> | undefined, Partial<import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>>> | undefined>>;
    readiness(): Promise<import("@nestjs/terminus").HealthCheckResult<(import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & (import("@nestjs/terminus").HealthIndicatorResult<string, "up", {
        [x: string]: unknown;
    }> | import("@nestjs/terminus").HealthIndicatorResult<string, "down", {
        message: string;
    }>)) & import("@nestjs/terminus").HealthIndicatorResult<"database">, Partial<(import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & (import("@nestjs/terminus").HealthIndicatorResult<string, "up", {
        [x: string]: unknown;
    }> | import("@nestjs/terminus").HealthIndicatorResult<string, "down", {
        message: string;
    }>)) & import("@nestjs/terminus").HealthIndicatorResult<"database">> | undefined, Partial<(import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & (import("@nestjs/terminus").HealthIndicatorResult<string, "up", {
        [x: string]: unknown;
    }> | import("@nestjs/terminus").HealthIndicatorResult<string, "down", {
        message: string;
    }>)) & import("@nestjs/terminus").HealthIndicatorResult<"database">> | undefined>>;
}
