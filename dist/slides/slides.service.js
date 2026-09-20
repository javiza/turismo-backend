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
exports.SlidesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const home_slide_entity_1 = require("./entities/home-slide.entity");
const destinos_service_1 = require("../destinos/destinos.service");
const paquetes_service_1 = require("../paquetes/paquetes.service");
const ofertas_service_1 = require("../ofertas/ofertas.service");
const noticias_service_1 = require("../noticias/noticias.service");
let SlidesService = class SlidesService {
    slideRepository;
    destinosService;
    paquetesService;
    ofertasService;
    noticiasService;
    constructor(slideRepository, destinosService, paquetesService, ofertasService, noticiasService) {
        this.slideRepository = slideRepository;
        this.destinosService = destinosService;
        this.paquetesService = paquetesService;
        this.ofertasService = ofertasService;
        this.noticiasService = noticiasService;
    }
    async validarReferencia(tipo, referenciaId) {
        try {
            switch (tipo) {
                case home_slide_entity_1.TipoSlide.DESTINO:
                    await this.destinosService.findOne(referenciaId);
                    return;
                case home_slide_entity_1.TipoSlide.PAQUETE:
                    await this.paquetesService.findOne(referenciaId);
                    return;
                case home_slide_entity_1.TipoSlide.OFERTA:
                    await this.ofertasService.findOne(referenciaId);
                    return;
                case home_slide_entity_1.TipoSlide.NOTICIA:
                    await this.noticiasService.findOne(referenciaId);
                    return;
            }
        }
        catch {
            throw new common_1.BadRequestException(`No se encontró un ${tipo} con id ${referenciaId} para usar en el slide`);
        }
    }
    async resolver(slide) {
        const base = {
            id: slide.id,
            tipo: slide.tipo,
            referenciaId: slide.referenciaId,
            orden: slide.orden,
            activo: slide.activo,
        };
        try {
            switch (slide.tipo) {
                case home_slide_entity_1.TipoSlide.DESTINO: {
                    const d = await this.destinosService.findOne(slide.referenciaId);
                    return {
                        ...base,
                        titulo: d.nombre,
                        descripcion: d.descripcion,
                        imagen: d.imagenPrincipal ?? null,
                        precio: d.precioDesde ?? null,
                        precioAnterior: null,
                        descuento: null,
                        fechaInicio: d.fechaInicio ?? null,
                        fechaFin: d.fechaFin ?? null,
                        paqueteId: null,
                        servicioVigente: d.activo,
                    };
                }
                case home_slide_entity_1.TipoSlide.PAQUETE: {
                    const p = await this.paquetesService.findOne(slide.referenciaId);
                    return {
                        ...base,
                        titulo: p.nombre,
                        descripcion: p.descripcion,
                        imagen: p.imagenPrincipal ?? null,
                        precio: p.precio,
                        precioAnterior: p.precioAnterior ?? null,
                        descuento: null,
                        fechaInicio: p.fechaInicio,
                        fechaFin: p.fechaFin,
                        paqueteId: p.id,
                        servicioVigente: p.activo,
                    };
                }
                case home_slide_entity_1.TipoSlide.OFERTA: {
                    const o = await this.ofertasService.findOne(slide.referenciaId);
                    return {
                        ...base,
                        titulo: o.titulo,
                        descripcion: o.descripcion ?? '',
                        imagen: o.imagenPrincipal ?? o.paquete?.imagenPrincipal ?? null,
                        precio: o.paquete?.precio ?? null,
                        precioAnterior: null,
                        descuento: o.descuento,
                        fechaInicio: o.fechaInicio,
                        fechaFin: o.fechaFin,
                        paqueteId: o.paqueteId,
                        servicioVigente: o.activa,
                    };
                }
                case home_slide_entity_1.TipoSlide.NOTICIA: {
                    const n = await this.noticiasService.findOne(slide.referenciaId);
                    return {
                        ...base,
                        titulo: n.titulo,
                        descripcion: n.contenido,
                        imagen: n.imagenUrl ?? null,
                        precio: null,
                        precioAnterior: null,
                        descuento: null,
                        fechaInicio: null,
                        fechaFin: null,
                        paqueteId: null,
                        servicioVigente: n.activa,
                    };
                }
            }
        }
        catch {
            return {
                ...base,
                titulo: '(servicio eliminado)',
                descripcion: '',
                imagen: null,
                precio: null,
                precioAnterior: null,
                descuento: null,
                fechaInicio: null,
                fechaFin: null,
                paqueteId: null,
                servicioVigente: false,
            };
        }
    }
    async publico() {
        const slides = await this.slideRepository.find({
            where: { activo: true },
            order: { orden: 'ASC', id: 'ASC' },
        });
        const resueltos = await Promise.all(slides.map((s) => this.resolver(s)));
        return resueltos.filter((s) => s.servicioVigente);
    }
    async findAllAdmin() {
        const slides = await this.slideRepository.find({
            order: { orden: 'ASC', id: 'ASC' },
        });
        return Promise.all(slides.map((s) => this.resolver(s)));
    }
    async opciones(tipo) {
        switch (tipo) {
            case home_slide_entity_1.TipoSlide.DESTINO: {
                const items = await this.destinosService.findAllAdmin();
                return items.map((d) => ({
                    id: d.id,
                    titulo: `${d.nombre} — ${d.ciudad}, ${d.pais}`,
                    imagen: d.imagenPrincipal ?? null,
                    activo: d.activo,
                }));
            }
            case home_slide_entity_1.TipoSlide.PAQUETE: {
                const items = await this.paquetesService.findAllAdmin();
                return items.map((p) => ({
                    id: p.id,
                    titulo: p.nombre,
                    imagen: p.imagenPrincipal ?? null,
                    activo: p.activo,
                }));
            }
            case home_slide_entity_1.TipoSlide.OFERTA: {
                const items = await this.ofertasService.findAllAdmin();
                return items.map((o) => ({
                    id: o.id,
                    titulo: o.titulo,
                    imagen: o.imagenPrincipal ?? null,
                    activo: o.activa,
                }));
            }
            case home_slide_entity_1.TipoSlide.NOTICIA: {
                const items = await this.noticiasService.findAllAdmin();
                return items.map((n) => ({
                    id: n.id,
                    titulo: n.titulo,
                    imagen: n.imagenUrl ?? null,
                    activo: n.activa,
                }));
            }
        }
    }
    async create(dto) {
        await this.validarReferencia(dto.tipo, dto.referenciaId);
        const maxOrden = await this.slideRepository.maximum('orden');
        const slide = this.slideRepository.create({
            tipo: dto.tipo,
            referenciaId: dto.referenciaId,
            orden: dto.orden ?? (maxOrden ?? -1) + 1,
            activo: dto.activo ?? true,
        });
        const guardado = await this.slideRepository.save(slide);
        return this.resolver(guardado);
    }
    async obtenerEntidad(id) {
        const slide = await this.slideRepository.findOne({ where: { id } });
        if (!slide) {
            throw new common_1.NotFoundException('Slide no encontrado');
        }
        return slide;
    }
    async update(id, dto) {
        const slide = await this.obtenerEntidad(id);
        Object.assign(slide, dto);
        const guardado = await this.slideRepository.save(slide);
        return this.resolver(guardado);
    }
    async remove(id) {
        const slide = await this.obtenerEntidad(id);
        await this.slideRepository.remove(slide);
    }
    async reordenar(dto) {
        await Promise.all(dto.ids.map((id, indice) => this.slideRepository.update({ id }, { orden: indice })));
        return this.findAllAdmin();
    }
};
exports.SlidesService = SlidesService;
exports.SlidesService = SlidesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(home_slide_entity_1.HomeSlide)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        destinos_service_1.DestinosService,
        paquetes_service_1.PaquetesService,
        ofertas_service_1.OfertasService,
        noticias_service_1.NoticiasService])
], SlidesService);
//# sourceMappingURL=slides.service.js.map