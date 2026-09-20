export declare const RESERVA_CREADA_EVENT = "reserva.creada";
export declare class ReservaCreadaEvent {
    readonly reservaId: number;
    readonly emailCliente: string | undefined;
    readonly nombreCliente: string;
    readonly nombrePaquete: string;
    readonly cantidadPersonas: number;
    readonly montoTotal: number | undefined;
    readonly fechaInicio: string;
    readonly fechaFin: string;
    constructor(reservaId: number, emailCliente: string | undefined, nombreCliente: string, nombrePaquete: string, cantidadPersonas: number, montoTotal: number | undefined, fechaInicio: string, fechaFin: string);
}
