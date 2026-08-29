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
exports.DestinosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const destino_entity_1 = require("./entities/destino.entity");
const destino_imagen_entity_1 = require("./entities/destino-imagen.entity");
const categoria_entity_1 = require("../categorias/entities/categoria.entity");
const cache_service_1 = require("../redis/cache.service");
const CACHE_PREFIX = 'destinos:';
const CACHE_TTL_SEGUNDOS = 300;
let DestinosService = class DestinosService {
    destinoRepository;
    destinoImagenRepository;
    categoriaRepository;
    cache;
    constructor(destinoRepository, destinoImagenRepository, categoriaRepository, cache) {
        this.destinoRepository = destinoRepository;
        this.destinoImagenRepository = destinoImagenRepository;
        this.categoriaRepository = categoriaRepository;
        this.cache = cache;
    }
    invalidarCache() {
        return this.cache.delByPrefix(CACHE_PREFIX);
    }
    validarFechas(fechaInicio, fechaFin) {
        if (new Date(fechaFin) <= new Date(fechaInicio)) {
            throw new common_1.BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
        }
    }
    async create(dto) {
        this.validarFechas(dto.fechaInicio, dto.fechaFin);
        const { imagenes, imagenPrincipal, ...resto } = dto;
        const destino = this.destinoRepository.create({
            ...resto,
            imagenPrincipal: imagenPrincipal ?? imagenes?.[0],
        });
        const guardado = await this.destinoRepository.save(destino);
        if (imagenes && imagenes.length > 0) {
            const principal = imagenPrincipal ?? imagenes[0];
            await this.destinoImagenRepository.save(imagenes.map((url) => this.destinoImagenRepository.create({
                destino: { id: guardado.id },
                url,
                esPrincipal: url === principal,
            })));
        }
        await this.invalidarCache();
        return this.findOne(guardado.id);
    }
    async findAll() {
        return this.cache.wrap(`${CACHE_PREFIX}list:public`, CACHE_TTL_SEGUNDOS, () => this.destinoRepository.find({
            where: { activo: true },
            relations: { categorias: true, imagenes: true },
            order: { nombre: 'ASC' },
        }));
    }
    async findAllAdmin() {
        return this.destinoRepository.find({
            relations: { categorias: true, imagenes: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const destino = await this.cache.wrap(`${CACHE_PREFIX}detail:${id}`, CACHE_TTL_SEGUNDOS, () => this.destinoRepository.findOne({
            where: { id },
            relations: { categorias: true, imagenes: true },
        }));
        if (!destino) {
            throw new common_1.NotFoundException('Destino no encontrado');
        }
        return destino;
    }
    async buscar(q) {
        if (!q || !q.trim()) {
            return this.findAll();
        }
        const clave = `${CACHE_PREFIX}search:${q.trim().toLowerCase()}`;
        return this.cache.wrap(clave, CACHE_TTL_SEGUNDOS, () => this.destinoRepository
            .createQueryBuilder('destino')
            .where('destino.activo = true')
            .andWhere(`destino.search_vector @@ plainto_tsquery('spanish', unaccent(:q))`, { q })
            .orderBy(`ts_rank(destino.search_vector, plainto_tsquery('spanish', unaccent(:q)))`, 'DESC')
            .getMany());
    }
    async update(id, dto) {
        const destino = await this.findOne(id);
        const fechaInicio = dto.fechaInicio ?? destino.fechaInicio;
        const fechaFin = dto.fechaFin ?? destino.fechaFin;
        if (fechaInicio && fechaFin) {
            this.validarFechas(fechaInicio, fechaFin);
        }
        Object.assign(destino, dto);
        const guardado = await this.destinoRepository.save(destino);
        await this.invalidarCache();
        return guardado;
    }
    async remove(id) {
        const destino = await this.findOne(id);
        try {
            await this.destinoRepository.remove(destino);
        }
        catch (error) {
            if (error instanceof typeorm_2.QueryFailedError &&
                error.code === '23503') {
                throw new common_1.ConflictException('No se puede eliminar: hay paquetes turísticos asociados a este destino. Desactívalo en su lugar.');
            }
            throw error;
        }
        await this.invalidarCache();
    }
    async agregarImagen(destinoId, url) {
        const destino = await this.findOne(destinoId);
        const esPrimera = !destino.imagenes || destino.imagenes.length === 0;
        const imagen = this.destinoImagenRepository.create({
            destino: { id: destinoId },
            url,
            esPrincipal: esPrimera,
        });
        const guardada = await this.destinoImagenRepository.save(imagen);
        if (esPrimera) {
            await this.destinoRepository.update(destinoId, { imagenPrincipal: url });
        }
        await this.invalidarCache();
        return guardada;
    }
    async eliminarImagen(destinoId, imagenId) {
        const imagen = await this.destinoImagenRepository.findOne({
            where: { id: imagenId, destinoId },
        });
        if (!imagen) {
            throw new common_1.NotFoundException('Imagen no encontrada para este destino');
        }
        const eraPrincipal = imagen.esPrincipal;
        await this.destinoImagenRepository.remove(imagen);
        if (eraPrincipal) {
            const siguiente = await this.destinoImagenRepository.findOne({
                where: { destinoId },
                order: { createdAt: 'ASC' },
            });
            if (siguiente) {
                siguiente.esPrincipal = true;
                await this.destinoImagenRepository.save(siguiente);
            }
            await this.destinoRepository.update(destinoId, {
                imagenPrincipal: siguiente?.url,
            });
        }
        await this.invalidarCache();
    }
    async marcarPrincipal(destinoId, imagenId) {
        const imagen = await this.destinoImagenRepository.findOne({
            where: { id: imagenId, destinoId },
        });
        if (!imagen) {
            throw new common_1.NotFoundException('Imagen no encontrada para este destino');
        }
        await this.destinoImagenRepository.update({ destinoId }, { esPrincipal: false });
        imagen.esPrincipal = true;
        await this.destinoImagenRepository.save(imagen);
        await this.destinoRepository.update(destinoId, {
            imagenPrincipal: imagen.url,
        });
        await this.invalidarCache();
        return imagen;
    }
    async agregarCategoria(destinoId, categoriaId) {
        const destino = await this.findOne(destinoId);
        const categoria = await this.categoriaRepository.findOne({
            where: { id: categoriaId },
        });
        if (!categoria) {
            throw new common_1.BadRequestException('La categoría indicada no existe');
        }
        destino.categorias = destino.categorias ?? [];
        if (!destino.categorias.some((c) => c.id === categoriaId)) {
            destino.categorias.push(categoria);
            await this.destinoRepository.save(destino);
            await this.invalidarCache();
        }
        return destino;
    }
    async quitarCategoria(destinoId, categoriaId) {
        const destino = await this.findOne(destinoId);
        destino.categorias = (destino.categorias ?? []).filter((c) => c.id !== categoriaId);
        await this.destinoRepository.save(destino);
        await this.invalidarCache();
        return destino;
    }
};
exports.DestinosService = DestinosService;
exports.DestinosService = DestinosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(destino_entity_1.Destino)),
    __param(1, (0, typeorm_1.InjectRepository)(destino_imagen_entity_1.DestinoImagen)),
    __param(2, (0, typeorm_1.InjectRepository)(categoria_entity_1.Categoria)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        cache_service_1.CacheService])
], DestinosService);
//# sourceMappingURL=destinos.service.js.map