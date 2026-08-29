import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { PagosService } from './pagos.service';
export declare class PagosController {
    private readonly pagosService;
    private readonly config;
    private readonly frontendUrl;
    constructor(pagosService: PagosService, config: ConfigService);
    iniciar(reservaId: number): Promise<{
        url: string;
        token: string;
    }>;
    retornoPost(tokenWs: string | undefined, tbkToken: string | undefined, tbkOrdenCompra: string | undefined, res: Response): Promise<void>;
    retornoGet(tokenWs: string | undefined, tbkToken: string | undefined, tbkOrdenCompra: string | undefined, res: Response): Promise<void>;
    private procesarRetorno;
    private urlResultado;
}
