import { Queue } from 'bullmq';
import { EmailJobData } from './email.queue';
import { ConfiguracionService } from '../configuracion/configuracion.service';
export declare class EmailService {
    private readonly configuracion;
    private readonly queue;
    private readonly logger;
    constructor(configuracion: ConfiguracionService, queue: Queue<EmailJobData>);
    private getTransporter;
    private send;
    sendImmediate(to: string, subject: string, html: string): Promise<void>;
    private getAdminAddress;
    enviarConfirmacionReserva(params: {
        email: string;
        nombreCliente: string;
        nombrePaquete: string;
        cantidadPersonas: number;
        montoTotal?: number;
        fechaInicio: string;
        fechaFin: string;
    }): Promise<void>;
    enviarConfirmacionCotizacion(params: {
        email: string;
        nombre: string;
        nombrePaquete?: string;
        nombreDestino?: string;
        nombreNoticia?: string;
    }): Promise<void>;
    notificarConsultaEscalada(params: {
        remitente: string;
        asunto: string;
        motivo: string;
    }): Promise<void>;
    notificarNuevoMensaje(params: {
        nombre: string;
        correo: string;
        asunto?: string;
        mensaje: string;
    }): Promise<void>;
    notificarNuevaCotizacion(params: {
        nombre: string;
        email: string;
        telefono?: string;
        nombrePaquete?: string;
        nombreDestino?: string;
        nombreNoticia?: string;
        cantidadPersonas?: number;
        mensaje?: string;
    }): Promise<void>;
    notificarRespuestaCotizacion(params: {
        email: string;
        nombre: string;
        respuesta: string;
        nombrePaquete?: string;
        nombreDestino?: string;
        nombreNoticia?: string;
    }): Promise<void>;
    enviarRecuperacionPassword(params: {
        email: string;
        nombre: string;
        resetUrl: string;
    }): Promise<void>;
    notificarProveedorNuevo(params: {
        nombreNegocio: string;
        rubro?: string;
        nombreContacto: string;
        correo: string;
        telefono: string;
        direccion?: string;
        descripcion: string;
        precioReferencial?: number;
    }): Promise<void>;
}
