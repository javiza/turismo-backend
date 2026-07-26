export const COTIZACION_CREADA_EVENT = 'cotizacion.creada';
export const COTIZACION_RESPONDIDA_EVENT = 'cotizacion.respondida';

export class CotizacionCreadaEvent {
  constructor(
    public readonly cotizacionId: number,
    public readonly nombre: string,
    public readonly email: string,
    public readonly telefono: string | undefined,
    public readonly cantidadPersonas: number,
    public readonly mensaje: string | undefined,
    public readonly nombrePaquete: string | undefined,
    public readonly nombreDestino: string | undefined,
  ) {}
}

export class CotizacionRespondidaEvent {
  constructor(
    public readonly cotizacionId: number,
    public readonly email: string,
    public readonly nombre: string,
    public readonly respuesta: string,
    public readonly nombrePaquete: string | undefined,
    public readonly nombreDestino: string | undefined,
  ) {}
}
