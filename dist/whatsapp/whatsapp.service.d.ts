import { Queue } from 'bullmq';
import { WhatsappJobData } from './whatsapp.queue';
import { ConfiguracionService } from '../configuracion/configuracion.service';
export declare class WhatsappService {
    private readonly configuracion;
    private readonly queue;
    private readonly logger;
    constructor(configuracion: ConfiguracionService, queue: Queue<WhatsappJobData>);
    private getConfig;
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
