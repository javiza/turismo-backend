import { DataSource, Repository } from 'typeorm';
import { AnalyticsEvento } from './entities/analytics-evento.entity';
import { CreateAnalyticsEventoDto } from './dto/create-analytics-evento.dto';
export declare class AnalyticsService {
    private readonly dataSource;
    private readonly eventoRepository;
    constructor(dataSource: DataSource, eventoRepository: Repository<AnalyticsEvento>);
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
    refrescarVistas(): Promise<void>;
}
