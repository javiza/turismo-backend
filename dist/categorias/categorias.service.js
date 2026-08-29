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
exports.CategoriasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const categoria_entity_1 = require("./entities/categoria.entity");
const cache_service_1 = require("../redis/cache.service");
const CACHE_KEY = 'categorias:list';
const CACHE_TTL_SEGUNDOS = 600;
let CategoriasService = class CategoriasService {
    categoriaRepository;
    cache;
    constructor(categoriaRepository, cache) {
        this.categoriaRepository = categoriaRepository;
        this.cache = cache;
    }
    async create(dto) {
        const categoria = this.categoriaRepository.create(dto);
        try {
            const guardada = await this.categoriaRepository.save(categoria);
            await this.cache.del(CACHE_KEY);
            return guardada;
        }
        catch (error) {
            if (this.isUniqueViolation(error)) {
                throw new common_1.ConflictException('Ya existe una categoría con ese nombre');
            }
            throw error;
        }
    }
    async findAll() {
        return this.cache.wrap(CACHE_KEY, CACHE_TTL_SEGUNDOS, () => this.categoriaRepository.find({ order: { nombre: 'ASC' } }));
    }
    async findOne(id) {
        const categoria = await this.categoriaRepository.findOne({
            where: { id },
        });
        if (!categoria) {
            throw new common_1.NotFoundException('Categoría no encontrada');
        }
        return categoria;
    }
    async update(id, dto) {
        const categoria = await this.findOne(id);
        Object.assign(categoria, dto);
        try {
            const guardada = await this.categoriaRepository.save(categoria);
            await this.cache.del(CACHE_KEY);
            return guardada;
        }
        catch (error) {
            if (this.isUniqueViolation(error)) {
                throw new common_1.ConflictException('Ya existe una categoría con ese nombre');
            }
            throw error;
        }
    }
    async remove(id) {
        const categoria = await this.findOne(id);
        await this.categoriaRepository.remove(categoria);
        await this.cache.del(CACHE_KEY);
    }
    isUniqueViolation(error) {
        return (error instanceof typeorm_2.QueryFailedError &&
            error.code === '23505');
    }
};
exports.CategoriasService = CategoriasService;
exports.CategoriasService = CategoriasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(categoria_entity_1.Categoria)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        cache_service_1.CacheService])
], CategoriasService);
//# sourceMappingURL=categorias.service.js.map