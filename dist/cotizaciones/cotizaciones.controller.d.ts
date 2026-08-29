import { CotizacionesService } from './cotizaciones.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { UpdateCotizacionDto } from './dto/update-cotizacion.dto';
import { AdminCotizacionDto } from './dto/admin-cotizacion.dto';
import type { JwtClientePayload } from '../clientes-auth/interfaces/jwt-cliente-payload.interface';
export declare class CotizacionesController {
    private readonly cotizacionesService;
    constructor(cotizacionesService: CotizacionesService);
    create(dto: CreateCotizacionDto, cliente?: JwtClientePayload): Promise<import("./entities/cotizacion.entity").Cotizacion>;
    findAll(): Promise<import("./entities/cotizacion.entity").Cotizacion[]>;
    contarNoLeidas(): Promise<{
        count: number;
    }>;
    findOne(id: string): Promise<import("./entities/cotizacion.entity").Cotizacion>;
    updateEstado(id: string, dto: UpdateCotizacionDto): Promise<import("./entities/cotizacion.entity").Cotizacion>;
    updateAdmin(id: string, dto: AdminCotizacionDto): Promise<import("./entities/cotizacion.entity").Cotizacion>;
    remove(id: string): Promise<void>;
}
