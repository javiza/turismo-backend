import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { PagoWebpay } from './entities/pago-webpay.entity';
import { Reserva } from '../reservas/entities/reserva.entity';
import { ConfiguracionService } from '../configuracion/configuracion.service';
interface ResultadoRetornoWebpay {
    reservaId: number;
    aprobado: boolean;
    anulado: boolean;
}
export declare class PagosService {
    private readonly config;
    private readonly configuracion;
    private readonly pagoRepository;
    private readonly reservaRepository;
    private readonly logger;
    private readonly backendUrl;
    private readonly frontendUrl;
    constructor(config: ConfigService, configuracion: ConfiguracionService, pagoRepository: Repository<PagoWebpay>, reservaRepository: Repository<Reserva>);
    private getTransaction;
    iniciar(reservaId: number): Promise<{
        url: string;
        token: string;
    }>;
    confirmar(tokenWs: string): Promise<ResultadoRetornoWebpay>;
    marcarAnulado(buyOrder: string): Promise<ResultadoRetornoWebpay>;
}
export {};
