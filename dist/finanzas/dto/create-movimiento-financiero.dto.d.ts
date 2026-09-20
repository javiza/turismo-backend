import { TipoMovimientoFinanciero, CategoriaGasto, MetodoPago } from '../entities/movimiento-financiero.entity';
export declare class CreateMovimientoFinancieroDto {
    tipo: TipoMovimientoFinanciero;
    monto: number;
    descripcion: string;
    categoria?: CategoriaGasto;
    clienteId?: number;
    pagadorNombre?: string;
    metodoPago?: MetodoPago;
}
