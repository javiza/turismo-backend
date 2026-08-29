"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
const redis_constants_1 = require("./redis.constants");
let CacheService = CacheService_1 = class CacheService {
    redis;
    logger = new common_1.Logger(CacheService_1.name);
    constructor(redis) {
        this.redis = redis;
    }
    async get(key) {
        try {
            const raw = await this.redis.get(key);
            return raw ? JSON.parse(raw) : null;
        }
        catch (error) {
            this.logger.warn(`No se pudo leer caché "${key}": ${error.message}`);
            return null;
        }
    }
    async set(key, value, ttlSeconds = 300) {
        try {
            await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        }
        catch (error) {
            this.logger.warn(`No se pudo escribir caché "${key}": ${error.message}`);
        }
    }
    async del(key) {
        try {
            await this.redis.del(key);
        }
        catch (error) {
            this.logger.warn(`No se pudo borrar caché "${key}": ${error.message}`);
        }
    }
    async delByPrefix(prefix) {
        try {
            const stream = this.redis.scanStream({ match: `${prefix}*`, count: 100 });
            const pipeline = this.redis.pipeline();
            let found = false;
            for await (const keys of stream) {
                if (keys.length) {
                    found = true;
                    keys.forEach((key) => pipeline.del(key));
                }
            }
            if (found) {
                await pipeline.exec();
            }
        }
        catch (error) {
            this.logger.warn(`No se pudo invalidar caché con prefijo "${prefix}": ${error.message}`);
        }
    }
    async wrap(key, ttlSeconds, loader) {
        const cached = await this.get(key);
        if (cached !== null) {
            return cached;
        }
        const fresh = await loader();
        await this.set(key, fresh, ttlSeconds);
        return fresh;
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = CacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_constants_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [ioredis_1.default])
], CacheService);
//# sourceMappingURL=cache.service.js.map