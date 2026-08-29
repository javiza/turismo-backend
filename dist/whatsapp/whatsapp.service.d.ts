import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { WhatsappJobData } from './whatsapp.queue';
export declare class WhatsappService {
    private readonly config;
    private readonly queue;
    private readonly logger;
    private readonly apiUrl;
    private readonly token;
    private readonly adminNumber;
    constructor(config: ConfigService, queue: Queue<WhatsappJobData>);
    private enviarTexto;
    enviarTextoImmediate(to: string, texto: string): Promise<void>;
    notificarProveedorNuevo(params: {
        nombreNegocio: string;
        rubro?: string;
        nombreContacto: string;
        telefono: string;
        correo: string;
    }): Promise<void>;
}
