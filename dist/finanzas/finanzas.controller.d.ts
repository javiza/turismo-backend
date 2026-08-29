import { FinanzasService } from './finanzas.service';
import { CreateMovimientoFinancieroDto } from './dto/create-movimiento-financiero.dto';
import { UpdateConfiguracionFinancieraDto } from './dto/update-configuracion-financiera.dto';
import { TipoMovimientoFinanciero } from './entities/movimiento-financiero.entity';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class FinanzasController {
    private readonly finanzasService;
    constructor(finanzasService: FinanzasService);
    resumen(): Promise<import("./finanzas.service").ResumenFinanciero>;
    obtenerConfiguracion(): Promise<import("./entities/configuracion-financiera.entity").ConfiguracionFinanciera>;
    actualizarConfiguracion(dto: UpdateConfiguracionFinancieraDto): Promise<import("./entities/configuracion-financiera.entity").ConfiguracionFinanciera>;
    ingresosMensuales(): Promise<import("./finanzas.service").IngresoMensual[]>;
    topPaquetes(): Promise<import("./finanzas.service").IngresoPorItem[]>;
    topDestinos(): Promise<import("./finanzas.service").IngresoPorItem[]>;
    listarMovimientos(tipo?: TipoMovimientoFinanciero): Promise<import("./entities/movimiento-financiero.entity").MovimientoFinanciero[]>;
    gastosPorCategoria(): Promise<import("./finanzas.service").GastoPorCategoria[]>;
    registrarMovimiento(dto: CreateMovimientoFinancieroDto, user: JwtPayload): Promise<import("./entities/movimiento-financiero.entity").MovimientoFinanciero>;
    eliminarMovimiento(id: number, user: JwtPayload): Promise<void>;
}
