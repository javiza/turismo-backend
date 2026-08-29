import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { PagoWebpay } from './entities/pago-webpay.entity';
import { Reserva } from '../reservas/entities/reserva.entity';
interface ResultadoRetornoWebpay {
    reservaId: number;
    aprobado: boolean;
    anulado: boolean;
}
export declare class PagosService {
    private readonly config;
    private readonly pagoRepository;
    private readonly reservaRepository;
    private readonly logger;
    private readonly transaction;
    private readonly esProduccion;
    private readonly backendUrl;
    private readonly frontendUrl;
    constructor(config: ConfigService, pagoRepository: Repository<PagoWebpay>, reservaRepository: Repository<Reserva>);
    iniciar(reservaId: number): Promise<{
        url: string;
        token: string;
    }>;
    confirmar(tokenWs: string): Promise<ResultadoRetornoWebpay>;
    marcarAnulado(buyOrder: string): Promise<ResultadoRetornoWebpay>;
}
export {};
