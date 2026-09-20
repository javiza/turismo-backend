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
var ReservaNotificacionesListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservaNotificacionesListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const email_service_1 = require("../../email/email.service");
const reserva_creada_event_1 = require("../../common/events/reserva-creada.event");
let ReservaNotificacionesListener = ReservaNotificacionesListener_1 = class ReservaNotificacionesListener {
    emailService;
    logger = new common_1.Logger(ReservaNotificacionesListener_1.name);
    constructor(emailService) {
        this.emailService = emailService;
    }
    async enviarConfirmacion(event) {
        if (!event.emailCliente) {
            return;
        }
        try {
            await this.emailService.enviarConfirmacionReserva({
                email: event.emailCliente,
                nombreCliente: event.nombreCliente,
                nombrePaquete: event.nombrePaquete,
                cantidadPersonas: event.cantidadPersonas,
                montoTotal: event.montoTotal,
                fechaInicio: event.fechaInicio,
                fechaFin: event.fechaFin,
            });
        }
        catch (error) {
            this.logger.error(`No se pudo encolar el correo de confirmación de la reserva ${event.reservaId}: ${error.message}`);
        }
    }
};
exports.ReservaNotificacionesListener = ReservaNotificacionesListener;
__decorate([
    (0, event_emitter_1.OnEvent)(reserva_creada_event_1.RESERVA_CREADA_EVENT, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reserva_creada_event_1.ReservaCreadaEvent]),
    __metadata("design:returntype", Promise)
], ReservaNotificacionesListener.prototype, "enviarConfirmacion", null);
exports.ReservaNotificacionesListener = ReservaNotificacionesListener = ReservaNotificacionesListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], ReservaNotificacionesListener);
//# sourceMappingURL=reserva-notificaciones.listener.js.map