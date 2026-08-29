import { Reserva } from '../../reservas/entities/reserva.entity';
export declare enum EstadoPagoWebpay {
    INICIADO = "INICIADO",
    AUTORIZADO = "AUTORIZADO",
    RECHAZADO = "RECHAZADO",
    ANULADO = "ANULADO"
}
export declare class PagoWebpay {
    id: number;
    reservaId: number;
    reserva: Reserva;
    buyOrder: string;
    sessionId: string;
    token?: string | null;
    monto: number;
    estado: EstadoPagoWebpay;
    codigoAutorizacion?: string | null;
    codigoRespuesta?: number | null;
    tipoPago?: string | null;
    cuotas?: number | null;
    ultimosDigitosTarjeta?: string | null;
    fechaTransaccion?: Date | null;
    respuestaCruda?: Record<string, unknown> | null;
    createdAt: Date;
}
