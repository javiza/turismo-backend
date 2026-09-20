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
exports.ReservasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const reserva_entity_1 = require("./entities/reserva.entity");
const paquete_entity_1 = require("../paquetes/entities/paquete.entity");
const oferta_entity_1 = require("../ofertas/entities/oferta.entity");
const reserva_creada_event_1 = require("../common/events/reserva-creada.event");
let ReservasService = class ReservasService {
    reservaRepository;
    eventEmitter;
    constructor(reservaRepository, eventEmitter) {
        this.reservaRepository = reservaRepository;
        this.eventEmitter = eventEmitter;
    }
    async create(dto, clienteId) {
        return this.reservaRepository.manager.transaction(async (manager) => {
            const paquete = await manager
                .getRepository(paquete_entity_1.Paquete)
                .createQueryBuilder('paquete')
                .setLock('pessimistic_write')
                .where('paquete.id = :id', { id: dto.paqueteId })
                .getOne();
            if (!paquete || !paquete.activo) {
                throw new common_1.NotFoundException('Paquete no encontrado o inactivo');
            }
            const raw = await manager
                .getRepository(reserva_entity_1.Reserva)
                .createQueryBuilder('reserva')
                .select('COALESCE(SUM(reserva.cantidadPersonas), 0)', 'ocupados')
                .where('reserva.paqueteId = :id', { id: dto.paqueteId })
                .andWhere('reserva.estado != :cancelada', {
                cancelada: reserva_entity_1.EstadoReserva.CANCELADA,
            })
                .getRawOne();
            const disponibles = paquete.cupos - Number(raw?.ocupados ?? 0);
            if (dto.cantidadPersonas > disponibles) {
                throw new common_1.ConflictException(disponibles > 0
                    ? `Solo quedan ${disponibles} cupo(s) disponibles para este paquete`
                    : 'No quedan cupos disponibles para este paquete');
            }
            const descuentoPct = await this.obtenerDescuentoActivo(manager.getRepository(oferta_entity_1.Oferta), dto.paqueteId);
            const montoTotal = paquete.precio * dto.cantidadPersonas * (1 - descuentoPct / 100);
            const reserva = manager.getRepository(reserva_entity_1.Reserva).create({
                nombreCliente: dto.nombreCliente,
                emailCliente: dto.emailCliente,
                telefono: dto.telefono,
                cantidadPersonas: dto.cantidadPersonas,
                montoTotal: Number(montoTotal.toFixed(2)),
                estado: reserva_entity_1.EstadoReserva.PENDIENTE,
                paquete: { id: dto.paqueteId },
                cliente: clienteId ? { id: clienteId } : undefined,
            });
            const guardada = await manager.getRepository(reserva_entity_1.Reserva).save(reserva);
            this.eventEmitter.emit(reserva_creada_event_1.RESERVA_CREADA_EVENT, new reserva_creada_event_1.ReservaCreadaEvent(guardada.id, dto.emailCliente, dto.nombreCliente, paquete.nombre, dto.cantidadPersonas, guardada.montoTotal, paquete.fechaInicio, paquete.fechaFin));
            return guardada;
        });
    }
    async obtenerDescuentoActivo(ofertaRepository, paqueteId) {
        const hoy = new Date().toISOString().slice(0, 10);
        const oferta = await ofertaRepository
            .createQueryBuilder('oferta')
            .where('oferta.paqueteId = :paqueteId', { paqueteId })
            .andWhere('oferta.activa = true')
            .andWhere('oferta.fechaInicio <= :hoy', { hoy })
            .andWhere('oferta.fechaFin >= :hoy', { hoy })
            .orderBy('oferta.descuento', 'DESC')
            .getOne();
        return oferta?.descuento ?? 0;
    }
    async findAll() {
        return this.reservaRepository.find({
            relations: { paquete: { destino: true }, cliente: true },
            order: { fechaReserva: 'DESC' },
        });
    }
    async findByCliente(clienteId) {
        return this.reservaRepository.find({
            where: { clienteId },
            relations: { paquete: true },
            order: { fechaReserva: 'DESC' },
        });
    }
    async findOne(id) {
        const reserva = await this.reservaRepository.findOne({
            where: { id },
            relations: { paquete: { destino: true }, cliente: true },
        });
        if (!reserva) {
            throw new common_1.NotFoundException('Reserva no encontrada');
        }
        return reserva;
    }
    async updateEstado(id, dto) {
        const reserva = await this.findOne(id);
        if (reserva.estado === reserva_entity_1.EstadoReserva.CANCELADA) {
            throw new common_1.BadRequestException('La reserva ya está cancelada, no se puede modificar');
        }
        reserva.estado = dto.estado;
        return this.reservaRepository.save(reserva);
    }
    async update(id, dto) {
        const reserva = await this.findOne(id);
        Object.assign(reserva, dto);
        return this.reservaRepository.save(reserva);
    }
    async remove(id) {
        const reserva = await this.findOne(id);
        await this.reservaRepository.remove(reserva);
    }
    async cancelarPropia(id, clienteId) {
        const reserva = await this.findOne(id);
        if (reserva.clienteId !== clienteId) {
            throw new common_1.ForbiddenException('Esta reserva no pertenece a tu cuenta');
        }
        if (reserva.estado === reserva_entity_1.EstadoReserva.CANCELADA) {
            throw new common_1.BadRequestException('La reserva ya está cancelada');
        }
        reserva.estado = reserva_entity_1.EstadoReserva.CANCELADA;
        return this.reservaRepository.save(reserva);
    }
};
exports.ReservasService = ReservasService;
exports.ReservasService = ReservasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reserva_entity_1.Reserva)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        event_emitter_1.EventEmitter2])
], ReservasService);
//# sourceMappingURL=reservas.service.js.map