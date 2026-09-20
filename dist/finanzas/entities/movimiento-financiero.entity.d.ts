import { User } from '../../users/entities/user.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';
export declare enum TipoMovimientoFinanciero {
    INGRESO_MANUAL = "INGRESO_MANUAL",
    EGRESO_MANUAL = "EGRESO_MANUAL",
    ROBO = "ROBO",
    ESTAFA = "ESTAFA",
    PERDIDA = "PERDIDA",
    AJUSTE = "AJUSTE"
}
export declare enum CategoriaGasto {
    OPERACIONAL = "OPERACIONAL",
    SUELDOS = "SUELDOS",
    MARKETING = "MARKETING",
    PROVEEDORES = "PROVEEDORES",
    MANTENIMIENTO = "MANTENIMIENTO",
    IMPUESTOS = "IMPUESTOS",
    OTRO = "OTRO"
}
export declare enum MetodoPago {
    EFECTIVO = "EFECTIVO",
    TRANSFERENCIA = "TRANSFERENCIA",
    TARJETA = "TARJETA",
    WEBPAY = "WEBPAY",
    OTRO = "OTRO"
}
export declare class MovimientoFinanciero {
    id: number;
    tipo: TipoMovimientoFinanciero;
    monto: number;
    descripcion: string;
    categoria?: CategoriaGasto | null;
    usuarioId?: number;
    usuario?: User;
    clienteId?: number | null;
    cliente?: Cliente | null;
    pagadorNombre?: string | null;
    metodoPago?: MetodoPago | null;
    createdAt: Date;
}
