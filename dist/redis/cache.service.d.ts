import Redis from 'ioredis';
export declare class CacheService {
    private readonly redis;
    private readonly logger;
    constructor(redis: Redis);
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
    delByPrefix(prefix: string): Promise<void>;
    wrap<T>(key: string, ttlSeconds: number, loader: () => Promise<T>): Promise<T>;
}
