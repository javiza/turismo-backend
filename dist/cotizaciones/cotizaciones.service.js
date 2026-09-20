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
exports.CotizacionesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const cotizacion_entity_1 = require("./entities/cotizacion.entity");
const paquete_entity_1 = require("../paquetes/entities/paquete.entity");
const destino_entity_1 = require("../destinos/entities/destino.entity");
const noticia_entity_1 = require("../noticias/entities/noticia.entity");
const cotizacion_events_1 = require("../common/events/cotizacion.events");
let CotizacionesService = class CotizacionesService {
    cotizacionRepository;
    paqueteRepository;
    destinoRepository;
    noticiaRepository;
    eventEmitter;
    constructor(cotizacionRepository, paqueteRepository, destinoRepository, noticiaRepository, eventEmitter) {
        this.cotizacionRepository = cotizacionRepository;
        this.paqueteRepository = paqueteRepository;
        this.destinoRepository = destinoRepository;
        this.noticiaRepository = noticiaRepository;
        this.eventEmitter = eventEmitter;
    }
    async create(dto, clienteId) {
        const cotizacion = this.cotizacionRepository.create({
            nombre: dto.nombre,
            email: dto.email,
            telefono: dto.telefono,
            cantidadPersonas: dto.cantidadPersonas ?? 1,
            mensaje: dto.mensaje,
            paquete: dto.paqueteId ? { id: dto.paqueteId } : undefined,
            destino: dto.destinoId ? { id: dto.destinoId } : undefined,
            noticia: dto.noticiaId ? { id: dto.noticiaId } : undefined,
            cliente: clienteId ? { id: clienteId } : undefined,
        });
        let guardada;
        try {
            guardada = await this.cotizacionRepository.save(cotizacion);
        }
        catch (error) {
            if (error instanceof typeorm_2.QueryFailedError &&
                error.code === '23503') {
                throw new common_1.BadRequestException('El paquete, destino o noticia indicado no existe');
            }
            throw error;
        }
        const nombrePaquete = dto.paqueteId
            ? (await this.paqueteRepository.findOne({ where: { id: dto.paqueteId } }))
                ?.nombre
            : undefined;
        const nombreDestino = dto.destinoId
            ? (await this.destinoRepository.findOne({ where: { id: dto.destinoId } }))
                ?.nombre
            : undefined;
        const nombreNoticia = dto.noticiaId
            ? (await this.noticiaRepository.findOne({ where: { id: dto.noticiaId } }))
                ?.titulo
            : undefined;
        this.eventEmitter.emit(cotizacion_events_1.COTIZACION_CREADA_EVENT, new cotizacion_events_1.CotizacionCreadaEvent(guardada.id, guardada.nombre, guardada.email, guardada.telefono, guardada.cantidadPersonas, guardada.mensaje, nombrePaquete, nombreDestino, nombreNoticia));
        return guardada;
    }
    async findAll() {
        return this.cotizacionRepository.find({
            relations: { paquete: true, destino: true, noticia: true },
            order: { createdAt: 'DESC' },
        });
    }
    async contarNoLeidas() {
        const count = await this.cotizacionRepository.count({
            where: { leida: false },
        });
        return { count };
    }
    async findByCliente(clienteId) {
        return this.cotizacionRepository.find({
            where: { clienteId },
            relations: { paquete: true, destino: true, noticia: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const cotizacion = await this.cotizacionRepository.findOne({
            where: { id },
            relations: { paquete: true, destino: true, noticia: true },
        });
        if (!cotizacion) {
            throw new common_1.NotFoundException('Cotización no encontrada');
        }
        return cotizacion;
    }
    async updateEstado(id, dto) {
        const cotizacion = await this.findOne(id);
        cotizacion.estado = dto.estado;
        return this.cotizacionRepository.save(cotizacion);
    }
    async updateAdmin(id, dto) {
        const cotizacion = await this.findOne(id);
        if (dto.leida !== undefined) {
            cotizacion.leida = dto.leida;
        }
        if (dto.estado !== undefined) {
            cotizacion.estado = dto.estado;
        }
        if (dto.respuesta !== undefined) {
            cotizacion.respuesta = dto.respuesta;
            cotizacion.respondidoEn = new Date();
            cotizacion.estado = cotizacion_entity_1.EstadoCotizacion.RESPONDIDA;
            cotizacion.leida = true;
        }
        const guardada = await this.cotizacionRepository.save(cotizacion);
        if (dto.respuesta !== undefined) {
            this.eventEmitter.emit(cotizacion_events_1.COTIZACION_RESPONDIDA_EVENT, new cotizacion_events_1.CotizacionRespondidaEvent(guardada.id, guardada.email, guardada.nombre, dto.respuesta, guardada.paquete?.nombre, guardada.destino?.nombre, guardada.noticia?.titulo));
        }
        return guardada;
    }
    async remove(id) {
        const cotizacion = await this.findOne(id);
        await this.cotizacionRepository.remove(cotizacion);
    }
};
exports.CotizacionesService = CotizacionesService;
exports.CotizacionesService = CotizacionesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cotizacion_entity_1.Cotizacion)),
    __param(1, (0, typeorm_1.InjectRepository)(paquete_entity_1.Paquete)),
    __param(2, (0, typeorm_1.InjectRepository)(destino_entity_1.Destino)),
    __param(3, (0, typeorm_1.InjectRepository)(noticia_entity_1.Noticia)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        event_emitter_1.EventEmitter2])
], CotizacionesService);
//# sourceMappingURL=cotizaciones.service.js.map