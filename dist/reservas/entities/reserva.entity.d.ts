import { Paquete } from '../../paquetes/entities/paquete.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { MetodoPago } from '../../finanzas/entities/movimiento-financiero.entity';
export declare enum EstadoReserva {
    PENDIENTE = "PENDIENTE",
    CONFIRMADA = "CONFIRMADA",
    CANCELADA = "CANCELADA"
}
export declare class Reserva {
    id: number;
    paqueteId: number;
    paquete: Paquete;
    clienteId?: number;
    cliente?: Cliente;
    nombreCliente: string;
    emailCliente?: string;
    telefono?: string;
    cantidadPersonas: number;
    montoTotal?: number;
    estado: EstadoReserva;
    fechaReserva: Date;
    metodoPago?: MetodoPago | null;
    pagadoEn?: Date | null;
}
