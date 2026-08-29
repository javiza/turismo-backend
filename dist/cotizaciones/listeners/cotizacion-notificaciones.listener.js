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
var CotizacionNotificacionesListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CotizacionNotificacionesListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const email_service_1 = require("../../email/email.service");
const cotizacion_events_1 = require("../../common/events/cotizacion.events");
let CotizacionNotificacionesListener = CotizacionNotificacionesListener_1 = class CotizacionNotificacionesListener {
    emailService;
    logger = new common_1.Logger(CotizacionNotificacionesListener_1.name);
    constructor(emailService) {
        this.emailService = emailService;
    }
    async alCrear(event) {
        try {
            await this.emailService.enviarConfirmacionCotizacion({
                email: event.email,
                nombre: event.nombre,
                nombrePaquete: event.nombrePaquete,
                nombreDestino: event.nombreDestino,
                nombreNoticia: event.nombreNoticia,
            });
            await this.emailService.notificarNuevaCotizacion({
                nombre: event.nombre,
                email: event.email,
                telefono: event.telefono,
                nombrePaquete: event.nombrePaquete,
                nombreDestino: event.nombreDestino,
                nombreNoticia: event.nombreNoticia,
                cantidadPersonas: event.cantidadPersonas,
                mensaje: event.mensaje,
            });
        }
        catch (error) {
            this.logger.error(`Fallo notificando la cotización ${event.cotizacionId}: ${error.message}`);
        }
    }
    async alResponder(event) {
        try {
            await this.emailService.notificarRespuestaCotizacion({
                email: event.email,
                nombre: event.nombre,
                respuesta: event.respuesta,
                nombrePaquete: event.nombrePaquete,
                nombreDestino: event.nombreDestino,
                nombreNoticia: event.nombreNoticia,
            });
        }
        catch (error) {
            this.logger.error(`Fallo notificando la respuesta de la cotización ${event.cotizacionId}: ${error.message}`);
        }
    }
};
exports.CotizacionNotificacionesListener = CotizacionNotificacionesListener;
__decorate([
    (0, event_emitter_1.OnEvent)(cotizacion_events_1.COTIZACION_CREADA_EVENT, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cotizacion_events_1.CotizacionCreadaEvent]),
    __metadata("design:returntype", Promise)
], CotizacionNotificacionesListener.prototype, "alCrear", null);
__decorate([
    (0, event_emitter_1.OnEvent)(cotizacion_events_1.COTIZACION_RESPONDIDA_EVENT, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cotizacion_events_1.CotizacionRespondidaEvent]),
    __metadata("design:returntype", Promise)
], CotizacionNotificacionesListener.prototype, "alResponder", null);
exports.CotizacionNotificacionesListener = CotizacionNotificacionesListener = CotizacionNotificacionesListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], CotizacionNotificacionesListener);
//# sourceMappingURL=cotizacion-notificaciones.listener.js.map