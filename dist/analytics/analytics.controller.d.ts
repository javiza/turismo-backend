import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsEventoDto } from './dto/create-analytics-evento.dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    registrarEvento(dto: CreateAnalyticsEventoDto): Promise<void>;
    dashboard(): Promise<Record<string, number>>;
    topDestinos(): Promise<{
        id: number;
        nombre: string;
        visitas: number;
    }[]>;
    topPaquetes(): Promise<{
        id: number;
        nombre: string;
        visitas: number;
    }[]>;
    tendenciaMensual(): Promise<{
        mes: string;
        visitas: number;
    }[]>;
    ventasMensuales(): Promise<{
        mes: Date;
        reservas: number;
        ingresos: number;
    }[]>;
    refrescarVistas(): Promise<{
        ok: boolean;
    }>;
}
