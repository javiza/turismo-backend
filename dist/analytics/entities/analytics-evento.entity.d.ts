import { Destino } from '../../destinos/entities/destino.entity';
import { Paquete } from '../../paquetes/entities/paquete.entity';
export declare class AnalyticsEvento {
    id: number;
    tipoEvento: string;
    destinoId?: number;
    destino?: Destino;
    paqueteId?: number;
    paquete?: Paquete;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}
