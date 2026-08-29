"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CotizacionRespondidaEvent = exports.CotizacionCreadaEvent = exports.COTIZACION_RESPONDIDA_EVENT = exports.COTIZACION_CREADA_EVENT = void 0;
exports.COTIZACION_CREADA_EVENT = 'cotizacion.creada';
exports.COTIZACION_RESPONDIDA_EVENT = 'cotizacion.respondida';
class CotizacionCreadaEvent {
    cotizacionId;
    nombre;
    email;
    telefono;
    cantidadPersonas;
    mensaje;
    nombrePaquete;
    nombreDestino;
    nombreNoticia;
    constructor(cotizacionId, nombre, email, telefono, cantidadPersonas, mensaje, nombrePaquete, nombreDestino, nombreNoticia) {
        this.cotizacionId = cotizacionId;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.cantidadPersonas = cantidadPersonas;
        this.mensaje = mensaje;
        this.nombrePaquete = nombrePaquete;
        this.nombreDestino = nombreDestino;
        this.nombreNoticia = nombreNoticia;
    }
}
exports.CotizacionCreadaEvent = CotizacionCreadaEvent;
class CotizacionRespondidaEvent {
    cotizacionId;
    email;
    nombre;
    respuesta;
    nombrePaquete;
    nombreDestino;
    nombreNoticia;
    constructor(cotizacionId, email, nombre, respuesta, nombrePaquete, nombreDestino, nombreNoticia) {
        this.cotizacionId = cotizacionId;
        this.email = email;
        this.nombre = nombre;
        this.respuesta = respuesta;
        this.nombrePaquete = nombrePaquete;
        this.nombreDestino = nombreDestino;
        this.nombreNoticia = nombreNoticia;
    }
}
exports.CotizacionRespondidaEvent = CotizacionRespondidaEvent;
//# sourceMappingURL=cotizacion.events.js.map