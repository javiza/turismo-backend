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
exports.OfertasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const oferta_entity_1 = require("./entities/oferta.entity");
const oferta_imagen_entity_1 = require("./entities/oferta-imagen.entity");
const paquete_entity_1 = require("../paquetes/entities/paquete.entity");
const paquete_imagen_entity_1 = require("../paquetes/entities/paquete-imagen.entity");
const destino_imagen_entity_1 = require("../destinos/entities/destino-imagen.entity");
const cache_service_1 = require("../redis/cache.service");
const CACHE_PREFIX = 'ofertas:';
const CACHE_TTL_SEGUNDOS = 120;
let OfertasService = class OfertasService {
    ofertaRepository;
    paqueteRepository;
    paqueteImagenRepository;
    destinoImagenRepository;
    ofertaImagenRepository;
    cache;
    constructor(ofertaRepository, paqueteRepository, paqueteImagenRepository, destinoImagenRepository, ofertaImagenRepository, cache) {
        this.ofertaRepository = ofertaRepository;
        this.paqueteRepository = paqueteRepository;
        this.paqueteImagenRepository = paqueteImagenRepository;
        this.destinoImagenRepository = destinoImagenRepository;
        this.ofertaImagenRepository = ofertaImagenRepository;
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
        const oferta = this.ofertaRepository.create({
            titulo: dto.titulo,
            descripcion: dto.descripcion,
            descuento: dto.descuento,
            fechaInicio: dto.fechaInicio,
            fechaFin: dto.fechaFin,
            paquete: { id: dto.paqueteId },
            imagenPrincipal: dto.imagenPrincipal ?? dto.imagenes?.[0],
        });
        let guardada;
        try {
            guardada = await this.ofertaRepository.save(oferta);
        }
        catch (error) {
            if (this.isForeignKeyViolation(error)) {
                throw new common_1.BadRequestException('El paquete indicado no existe');
            }
            throw error;
        }
        if (dto.imagenes && dto.imagenes.length > 0) {
            const principal = dto.imagenPrincipal ?? dto.imagenes[0];
            await this.ofertaImagenRepository.save(dto.imagenes.map((url) => this.ofertaImagenRepository.create({
                oferta: { id: guardada.id },
                url,
                esPrincipal: url === principal,
            })));
        }
        else {
            await this.heredarImagenes(guardada.id, dto.paqueteId);
        }
        await this.invalidarCache();
        return this.findOne(guardada.id);
    }
    async heredarImagenes(ofertaId, paqueteId) {
        let fuente = await this.paqueteImagenRepository.find({
            where: { paqueteId },
            order: { createdAt: 'ASC' },
        });
        if (fuente.length === 0) {
            const paquete = await this.paqueteRepository.findOne({
                where: { id: paqueteId },
            });
            if (paquete) {
                const imagenesDestino = await this.destinoImagenRepository.find({
                    where: { destinoId: paquete.destinoId },
                    order: { createdAt: 'ASC' },
                });
                fuente = imagenesDestino.map((img) => ({
                    url: img.url,
                    esPrincipal: img.esPrincipal,
                }));
            }
        }
        if (!fuente || fuente.length === 0) {
            return;
        }
        await this.ofertaImagenRepository.save(fuente.map((img) => this.ofertaImagenRepository.create({
            oferta: { id: ofertaId },
            url: img.url,
            esPrincipal: img.esPrincipal,
        })));
        const principal = fuente.find((i) => i.esPrincipal) ?? fuente[0];
        await this.ofertaRepository.update(ofertaId, {
            imagenPrincipal: principal.url,
        });
    }
    async findAll() {
        const hoy = new Date().toISOString().slice(0, 10);
        return this.cache.wrap(`${CACHE_PREFIX}list:public:${hoy}`, CACHE_TTL_SEGUNDOS, () => this.ofertaRepository.find({
            where: {
                activa: true,
                fechaInicio: (0, typeorm_2.LessThanOrEqual)(hoy),
                fechaFin: (0, typeorm_2.MoreThanOrEqual)(hoy),
            },
            relations: { paquete: true, imagenes: true },
            order: { fechaInicio: 'ASC' },
        }));
    }
    async findAllAdmin() {
        return this.ofertaRepository.find({
            relations: { paquete: true, imagenes: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const oferta = await this.cache.wrap(`${CACHE_PREFIX}detail:${id}`, CACHE_TTL_SEGUNDOS, () => this.ofertaRepository.findOne({
            where: { id },
            relations: { paquete: true, imagenes: true },
        }));
        if (!oferta) {
            throw new common_1.NotFoundException('Oferta no encontrada');
        }
        return oferta;
    }
    async update(id, dto) {
        const oferta = await this.findOne(id);
        const fechaInicio = dto.fechaInicio ?? oferta.fechaInicio;
        const fechaFin = dto.fechaFin ?? oferta.fechaFin;
        this.validarFechas(fechaInicio, fechaFin);
        const { paqueteId, ...resto } = dto;
        if (typeof resto.activa === 'boolean' && resto.activa !== oferta.activa) {
            oferta.fechaDesactivacion = resto.activa ? null : new Date();
        }
        Object.assign(oferta, resto);
        if (paqueteId) {
            oferta.paquete = { id: paqueteId };
        }
        try {
            const guardada = await this.ofertaRepository.save(oferta);
            await this.invalidarCache();
            return guardada;
        }
        catch (error) {
            if (this.isForeignKeyViolation(error)) {
                throw new common_1.BadRequestException('El paquete indicado no existe');
            }
            throw error;
        }
    }
    async remove(id) {
        const oferta = await this.findOne(id);
        await this.ofertaRepository.remove(oferta);
        await this.invalidarCache();
    }
    isForeignKeyViolation(error) {
        return (error instanceof typeorm_2.QueryFailedError &&
            error.code === '23503');
    }
    async limpiarDesactivadasAntiguas(mesesRetencion) {
        const limite = new Date();
        limite.setMonth(limite.getMonth() - mesesRetencion);
        const candidatas = await this.ofertaRepository.find({
            where: { activa: false },
            select: { id: true, fechaDesactivacion: true },
        });
        let borradas = 0;
        for (const candidata of candidatas) {
            if (!candidata.fechaDesactivacion ||
                candidata.fechaDesactivacion > limite) {
                continue;
            }
            try {
                await this.remove(candidata.id);
                borradas += 1;
            }
            catch {
            }
        }
        return borradas;
    }
    async agregarImagen(ofertaId, url) {
        const oferta = await this.findOne(ofertaId);
        const esPrimera = !oferta.imagenes || oferta.imagenes.length === 0;
        const imagen = this.ofertaImagenRepository.create({
            oferta: { id: ofertaId },
            url,
            esPrincipal: esPrimera,
        });
        const guardada = await this.ofertaImagenRepository.save(imagen);
        if (esPrimera) {
            await this.ofertaRepository.update(ofertaId, { imagenPrincipal: url });
        }
        return guardada;
    }
    async eliminarImagen(ofertaId, imagenId) {
        const imagen = await this.ofertaImagenRepository.findOne({
            where: { id: imagenId, ofertaId },
        });
        if (!imagen) {
            throw new common_1.NotFoundException('Imagen no encontrada para esta oferta');
        }
        const eraPrincipal = imagen.esPrincipal;
        await this.ofertaImagenRepository.remove(imagen);
        if (eraPrincipal) {
            const siguiente = await this.ofertaImagenRepository.findOne({
                where: { ofertaId },
                order: { createdAt: 'ASC' },
            });
            if (siguiente) {
                siguiente.esPrincipal = true;
                await this.ofertaImagenRepository.save(siguiente);
            }
            await this.ofertaRepository.update(ofertaId, {
                imagenPrincipal: siguiente?.url,
            });
        }
    }
    async marcarPrincipal(ofertaId, imagenId) {
        const imagen = await this.ofertaImagenRepository.findOne({
            where: { id: imagenId, ofertaId },
        });
        if (!imagen) {
            throw new common_1.NotFoundException('Imagen no encontrada para esta oferta');
        }
        await this.ofertaImagenRepository.update({ ofertaId }, { esPrincipal: false });
        imagen.esPrincipal = true;
        await this.ofertaImagenRepository.save(imagen);
        await this.ofertaRepository.update(ofertaId, {
            imagenPrincipal: imagen.url,
        });
        return imagen;
    }
};
exports.OfertasService = OfertasService;
exports.OfertasService = OfertasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(oferta_entity_1.Oferta)),
    __param(1, (0, typeorm_1.InjectRepository)(paquete_entity_1.Paquete)),
    __param(2, (0, typeorm_1.InjectRepository)(paquete_imagen_entity_1.PaqueteImagen)),
    __param(3, (0, typeorm_1.InjectRepository)(destino_imagen_entity_1.DestinoImagen)),
    __param(4, (0, typeorm_1.InjectRepository)(oferta_imagen_entity_1.OfertaImagen)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        cache_service_1.CacheService])
], OfertasService);
//# sourceMappingURL=ofertas.service.js.map