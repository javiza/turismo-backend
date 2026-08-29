import { Destino } from '../../destinos/entities/destino.entity';
import { Paquete } from '../../paquetes/entities/paquete.entity';
export declare class Visita {
    id: number;
    destinoId?: number;
    destino?: Destino;
    paqueteId?: number;
    paquete?: Paquete;
    ip?: string;
    pais?: string;
    ciudad?: string;
    userAgent?: string;
    createdAt: Date;
}
