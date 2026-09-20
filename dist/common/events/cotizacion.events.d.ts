export declare const COTIZACION_CREADA_EVENT = "cotizacion.creada";
export declare const COTIZACION_RESPONDIDA_EVENT = "cotizacion.respondida";
export declare class CotizacionCreadaEvent {
    readonly cotizacionId: number;
    readonly nombre: string;
    readonly email: string;
    readonly telefono: string | undefined;
    readonly cantidadPersonas: number;
    readonly mensaje: string | undefined;
    readonly nombrePaquete: string | undefined;
    readonly nombreDestino: string | undefined;
    readonly nombreNoticia: string | undefined;
    constructor(cotizacionId: number, nombre: string, email: string, telefono: string | undefined, cantidadPersonas: number, mensaje: string | undefined, nombrePaquete: string | undefined, nombreDestino: string | undefined, nombreNoticia: string | undefined);
}
export declare class CotizacionRespondidaEvent {
    readonly cotizacionId: number;
    readonly email: string;
    readonly nombre: string;
    readonly respuesta: string;
    readonly nombrePaquete: string | undefined;
    readonly nombreDestino: string | undefined;
    readonly nombreNoticia: string | undefined;
    constructor(cotizacionId: number, email: string, nombre: string, respuesta: string, nombrePaquete: string | undefined, nombreDestino: string | undefined, nombreNoticia: string | undefined);
}
