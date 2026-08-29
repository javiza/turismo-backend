"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservaCreadaEvent = exports.RESERVA_CREADA_EVENT = void 0;
exports.RESERVA_CREADA_EVENT = 'reserva.creada';
class ReservaCreadaEvent {
    reservaId;
    emailCliente;
    nombreCliente;
    nombrePaquete;
    cantidadPersonas;
    montoTotal;
    fechaInicio;
    fechaFin;
    constructor(reservaId, emailCliente, nombreCliente, nombrePaquete, cantidadPersonas, montoTotal, fechaInicio, fechaFin) {
        this.reservaId = reservaId;
        this.emailCliente = emailCliente;
        this.nombreCliente = nombreCliente;
        this.nombrePaquete = nombrePaquete;
        this.cantidadPersonas = cantidadPersonas;
        this.montoTotal = montoTotal;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }
}
exports.ReservaCreadaEvent = ReservaCreadaEvent;
//# sourceMappingURL=reserva-creada.event.js.map