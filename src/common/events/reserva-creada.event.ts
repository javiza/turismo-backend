export const RESERVA_CREADA_EVENT = 'reserva.creada';

/**
 * Se emite cuando una reserva queda guardada (dentro de create()), fuera
 * de la transacción de BD. Cualquier listener que reaccione a esto (hoy:
 * notificaciones por correo) queda desacoplado de ReservasService — se
 * puede agregar/quitar un listener sin tocar la lógica de negocio de
 * reservas.
 */
export class ReservaCreadaEvent {
  constructor(
    public readonly reservaId: number,
    public readonly emailCliente: string | undefined,
    public readonly nombreCliente: string,
    public readonly nombrePaquete: string,
    public readonly cantidadPersonas: number,
    public readonly montoTotal: number | undefined,
    public readonly fechaInicio: string,
    public readonly fechaFin: string,
  ) {}
}
