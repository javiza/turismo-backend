import { EstadoReserva } from '../entities/reserva.entity';
export declare class AdminUpdateReservaDto {
    nombreCliente?: string;
    emailCliente?: string;
    telefono?: string;
    cantidadPersonas?: number;
    montoTotal?: number;
    estado?: EstadoReserva;
}
