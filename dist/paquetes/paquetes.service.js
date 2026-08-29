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
exports.PaquetesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const paquete_entity_1 = require("./entities/paquete.entity");
const paquete_imagen_entity_1 = require("./entities/paquete-imagen.entity");
const destino_imagen_entity_1 = require("../destinos/entities/destino-imagen.entity");
const cache_service_1 = require("../redis/cache.service");
const CACHE_PREFIX = 'paquetes:';
const CACHE_TTL_SEGUNDOS = 300;
let PaquetesService = class PaquetesService {
    paqueteRepository;
    paqueteImagenRepository;
    destinoImagenRepository;
    cache;
    constructor(paqueteRepository, paqueteImagenRepository, destinoImagenRepository, cache) {
        this.paqueteRepository = paqueteRepository;
        this.paqueteImagenRepository = paqueteImagenRepository;
        this.destinoImagenRepository = destinoImagenRepository;
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
        const paquete = this.paqueteRepository.create({
            nombre: dto.nombre,
            descripcion: dto.descripcion,
            precio: dto.precio,
            cupos: dto.cupos,
            fechaInicio: dto.fechaInicio,
            fechaFin: dto.fechaFin,
            destino: { id: dto.destinoId },
            imagenPrincipal: dto.imagenPrincipal ?? dto.imagenes?.[0],
        });
        let guardado;
        try {
            guardado = await this.paqueteRepository.save(paquete);
        }
        catch (error) {
            if (this.isForeignKeyViolation(error)) {
                throw new common_1.BadRequestException('El destino indicado no existe');
            }
            throw error;
        }
        if (dto.imagenes && dto.imagenes.length > 0) {
            const principal = dto.imagenPrincipal ?? dto.imagenes[0];
            await this.paqueteImagenRepository.save(dto.imagenes.map((url) => this.paqueteImagenRepository.create({
                paquete: { id: guardado.id },
                url,
                esPrincipal: url === principal,
            })));
        }
        else {
            await this.heredarImagenesDeDestino(guardado.id, dto.destinoId);
        }
        await this.invalidarCache();
        return this.findOne(guardado.id);
    }
    async heredarImagenesDeDestino(paqueteId, destinoId) {
        const imagenesDestino = await this.destinoImagenRepository.find({
            where: { destinoId },
            order: { createdAt: 'ASC' },
        });
        if (imagenesDestino.length === 0) {
            return;
        }
        await this.paqueteImagenRepository.save(imagenesDestino.map((img) => this.paqueteImagenRepository.create({
            paquete: { id: paqueteId },
            url: img.url,
            esPrincipal: img.esPrincipal,
        })));
        const principal = imagenesDestino.find((i) => i.esPrincipal) ?? imagenesDestino[0];
        await this.paqueteRepository.update(paqueteId, {
            imagenPrincipal: principal.url,
        });
    }
    async findAll() {
        return this.cache.wrap(`${CACHE_PREFIX}list:public`, CACHE_TTL_SEGUNDOS, () => this.paqueteRepository.find({
            where: { activo: true },
            relations: { destino: true, imagenes: true },
            order: { fechaInicio: 'ASC' },
        }));
    }
    async findAllAdmin() {
        return this.paqueteRepository.find({
            relations: { destino: true, imagenes: true },
            order: { createdAt: 'DESC' },
        });
    }
    async buscar(q) {
        if (!q || !q.trim()) {
            return this.findAll();
        }
        const clave = `${CACHE_PREFIX}search:${q.trim().toLowerCase()}`;
        return this.cache.wrap(clave, CACHE_TTL_SEGUNDOS, () => this.paqueteRepository
            .createQueryBuilder('paquete')
            .leftJoinAndSelect('paquete.destino', 'destino')
            .where('paquete.activo = true')
            .andWhere(`paquete.search_vector @@ plainto_tsquery('spanish', unaccent(:q))`, { q })
            .orderBy(`ts_rank(paquete.search_vector, plainto_tsquery('spanish', unaccent(:q)))`, 'DESC')
            .getMany());
    }
    async findOne(id) {
        const paquete = await this.cache.wrap(`${CACHE_PREFIX}detail:${id}`, CACHE_TTL_SEGUNDOS, () => this.paqueteRepository.findOne({
            where: { id },
            relations: { destino: true, imagenes: true },
        }));
        if (!paquete) {
            throw new common_1.NotFoundException('Paquete no encontrado');
        }
        return paquete;
    }
    async update(id, dto) {
        const paquete = await this.findOne(id);
        const fechaInicio = dto.fechaInicio ?? paquete.fechaInicio;
        const fechaFin = dto.fechaFin ?? paquete.fechaFin;
        this.validarFechas(fechaInicio, fechaFin);
        const { destinoId, limpiarPrecioAnterior, ...resto } = dto;
        if (typeof resto.precio === 'number' &&
            resto.precio < Number(paquete.precio)) {
            paquete.precioAnterior = Number(paquete.precio);
        }
        if (typeof resto.activo === 'boolean' && resto.activo !== paquete.activo) {
            paquete.fechaDesactivacion = resto.activo ? null : new Date();
        }
        Object.assign(paquete, resto);
        if (destinoId) {
            paquete.destino = { id: destinoId };
        }
        let guardado;
        try {
            guardado = await this.paqueteRepository.save(paquete);
        }
        catch (error) {
            if (this.isForeignKeyViolation(error)) {
                throw new common_1.BadRequestException('El destino indicado no existe');
            }
            throw error;
        }
        if (limpiarPrecioAnterior) {
            await this.paqueteRepository
                .createQueryBuilder()
                .update(paquete_entity_1.Paquete)
                .set({ precioAnterior: () => 'NULL' })
                .where('id = :id', { id })
                .execute();
            guardado.precioAnterior = undefined;
        }
        await this.invalidarCache();
        return guardado;
    }
    async remove(id) {
        const paquete = await this.findOne(id);
        try {
            await this.paqueteRepository.remove(paquete);
        }
        catch (error) {
            if (this.isForeignKeyViolation(error)) {
                throw new common_1.ConflictException('No se puede eliminar: hay reservas, ofertas o cotizaciones asociadas a este paquete. Desactívalo en su lugar.');
            }
            throw error;
        }
        await this.invalidarCache();
    }
    isForeignKeyViolation(error) {
        return (error instanceof typeorm_2.QueryFailedError &&
            error.code === '23503');
    }
    async limpiarDesactivadosAntiguos(mesesRetencion) {
        const limite = new Date();
        limite.setMonth(limite.getMonth() - mesesRetencion);
        const candidatos = await this.paqueteRepository.find({
            where: { activo: false },
            select: { id: true, fechaDesactivacion: true },
        });
        let borrados = 0;
        for (const candidato of candidatos) {
            if (!candidato.fechaDesactivacion ||
                candidato.fechaDesactivacion > limite) {
                continue;
            }
            try {
                await this.remove(candidato.id);
                borrados += 1;
            }
            catch {
            }
        }
        return borrados;
    }
    async agregarImagen(paqueteId, url) {
        const paquete = await this.findOne(paqueteId);
        const esPrimera = !paquete.imagenes || paquete.imagenes.length === 0;
        const imagen = this.paqueteImagenRepository.create({
            paquete: { id: paqueteId },
            url,
            esPrincipal: esPrimera,
        });
        const guardada = await this.paqueteImagenRepository.save(imagen);
        if (esPrimera) {
            await this.paqueteRepository.update(paqueteId, { imagenPrincipal: url });
        }
        return guardada;
    }
    async eliminarImagen(paqueteId, imagenId) {
        const imagen = await this.paqueteImagenRepository.findOne({
            where: { id: imagenId, paqueteId },
        });
        if (!imagen) {
            throw new common_1.NotFoundException('Imagen no encontrada para este paquete');
        }
        const eraPrincipal = imagen.esPrincipal;
        await this.paqueteImagenRepository.remove(imagen);
        if (eraPrincipal) {
            const siguiente = await this.paqueteImagenRepository.findOne({
                where: { paqueteId },
                order: { createdAt: 'ASC' },
            });
            if (siguiente) {
                siguiente.esPrincipal = true;
                await this.paqueteImagenRepository.save(siguiente);
            }
            await this.paqueteRepository.update(paqueteId, {
                imagenPrincipal: siguiente?.url,
            });
        }
    }
    async marcarPrincipal(paqueteId, imagenId) {
        const imagen = await this.paqueteImagenRepository.findOne({
            where: { id: imagenId, paqueteId },
        });
        if (!imagen) {
            throw new common_1.NotFoundException('Imagen no encontrada para este paquete');
        }
        await this.paqueteImagenRepository.update({ paqueteId }, { esPrincipal: false });
        imagen.esPrincipal = true;
        await this.paqueteImagenRepository.save(imagen);
        await this.paqueteRepository.update(paqueteId, {
            imagenPrincipal: imagen.url,
        });
        return imagen;
    }
};
exports.PaquetesService = PaquetesService;
exports.PaquetesService = PaquetesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(paquete_entity_1.Paquete)),
    __param(1, (0, typeorm_1.InjectRepository)(paquete_imagen_entity_1.PaqueteImagen)),
    __param(2, (0, typeorm_1.InjectRepository)(destino_imagen_entity_1.DestinoImagen)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        cache_service_1.CacheService])
], PaquetesService);
//# sourceMappingURL=paquetes.service.js.map