import { ConfigService } from '@nestjs/config';
export interface ContextoCatalogo {
    paquetes: Array<{
        nombre: string;
        destino: string;
        precio: number;
        cupos: number;
        fechaInicio: string;
        fechaFin: string;
    }>;
    ofertas: Array<{
        nombre: string;
        descuento: number;
        vigenciaFin: string;
    }>;
}
export type ResultadoIa = {
    confianza: 'alta';
    respuesta: string;
} | {
    confianza: 'baja';
    motivo: string;
};
export declare class IaService {
    private readonly config;
    private readonly logger;
    private readonly client;
    constructor(config: ConfigService);
    estaActivo(): boolean;
    responderConsulta(pregunta: string, contexto: ContextoCatalogo): Promise<ResultadoIa>;
    private parsearRespuesta;
}
