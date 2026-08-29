import { Repository } from 'typeorm';
import { Reserva } from '../reservas/entities/reserva.entity';
import { MovimientoFinanciero, TipoMovimientoFinanciero, CategoriaGasto } from './entities/movimiento-financiero.entity';
import { ConfiguracionFinanciera } from './entities/configuracion-financiera.entity';
import { CreateMovimientoFinancieroDto } from './dto/create-movimiento-financiero.dto';
import { UpdateConfiguracionFinancieraDto } from './dto/update-configuracion-financiera.dto';
export interface ResumenFinanciero {
    ingresosConfirmados: number;
    ingresosPendientes: number;
    ingresosCancelados: number;
    ticketPromedio: number;
    totalReservas: number;
    reservasConfirmadas: number;
    reservasPendientes: number;
    reservasCanceladas: number;
    personasConfirmadas: number;
    ingresosManuales: number;
    egresosManuales: number;
    perdidasManuales: number;
    gananciasTotales: number;
    gastosTotales: number;
    porcentajeImpuesto: number;
    impuestos: number;
    gananciaNeta: number;
}
export interface IngresoMensual {
    mes: string;
    confirmados: number;
    pendientes: number;
    cancelados: number;
}
export interface IngresoPorItem {
    id: number;
    nombre: string;
    ingresos: number;
    reservas: number;
}
export interface GastoPorCategoria {
    categoria: CategoriaGasto | 'SIN_CATEGORIA';
    total: number;
}
export declare class FinanzasService {
    private readonly reservaRepository;
    private readonly movimientoRepository;
    private readonly configuracionRepository;
    constructor(reservaRepository: Repository<Reserva>, movimientoRepository: Repository<MovimientoFinanciero>, configuracionRepository: Repository<ConfiguracionFinanciera>);
    resumen(): Promise<ResumenFinanciero>;
    obtenerConfiguracion(): Promise<ConfiguracionFinanciera>;
    actualizarConfiguracion(dto: UpdateConfiguracionFinancieraDto): Promise<ConfiguracionFinanciera>;
    private totalesMovimientosManuales;
    listarMovimientos(tipo?: TipoMovimientoFinanciero): Promise<MovimientoFinanciero[]>;
    registrarMovimiento(dto: CreateMovimientoFinancieroDto, usuarioId: number): Promise<MovimientoFinanciero>;
    gastosPorCategoria(): Promise<GastoPorCategoria[]>;
    eliminarMovimiento(id: number, rol: string): Promise<void>;
    ingresosMensuales(): Promise<IngresoMensual[]>;
    topPaquetes(limite?: number): Promise<IngresoPorItem[]>;
    topDestinos(limite?: number): Promise<IngresoPorItem[]>;
}
