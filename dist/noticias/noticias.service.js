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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticiasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const noticia_entity_1 = require("./entities/noticia.entity");
const cache_service_1 = require("../redis/cache.service");
const CACHE_PREFIX = 'noticias:';
const CACHE_TTL_SEGUNDOS = 120;
let NoticiasService = class NoticiasService {
    noticiaRepository;
    cache;
    constructor(noticiaRepository, cache) {
        this.noticiaRepository = noticiaRepository;
        this.cache = cache;
    }
    invalidarCache() {
        return this.cache.delByPrefix(CACHE_PREFIX);
    }
    async create(dto, autorId) {
        const noticia = this.noticiaRepository.create({
            ...dto,
            autorId,
        });
        const guardada = await this.noticiaRepository.save(noticia);
        await this.invalidarCache();
        return this.findOne(guardada.id);
    }
    async findAll() {
        return this.cache.wrap(`${CACHE_PREFIX}list:public`, CACHE_TTL_SEGUNDOS, () => this.noticiaRepository.find({
            where: { activa: true },
            order: { createdAt: 'DESC' },
        }));
    }
    async findAllAdmin() {
        return this.noticiaRepository.find({
            relations: { autor: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const noticia = await this.noticiaRepository.findOne({
            where: { id },
            relations: { autor: true },
        });
        if (!noticia) {
            throw new common_1.NotFoundException('Noticia no encontrada');
        }
        return noticia;
    }
    async update(id, dto) {
        const noticia = await this.findOne(id);
        Object.assign(noticia, dto);
        const guardada = await this.noticiaRepository.save(noticia);
        await this.invalidarCache();
        return guardada;
    }
    async remove(id) {
        const noticia = await this.findOne(id);
        await this.noticiaRepository.remove(noticia);
        await this.invalidarCache();
    }
    async count() {
        return this.noticiaRepository.count();
    }
};
exports.NoticiasService = NoticiasService;
exports.NoticiasService = NoticiasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(noticia_entity_1.Noticia)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        cache_service_1.CacheService])
], NoticiasService);
//# sourceMappingURL=noticias.service.js.map