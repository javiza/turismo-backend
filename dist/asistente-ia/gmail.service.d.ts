import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export interface CorreoEntrante {
    id: string;
    threadId: string;
    remitente: string;
    asunto: string;
    cuerpo: string;
}
export declare class GmailService implements OnModuleInit {
    private readonly config;
    private readonly logger;
    private gmail;
    constructor(config: ConfigService);
    onModuleInit(): void;
    estaActivo(): boolean;
    listarNoLeidos(maxResultados?: number): Promise<CorreoEntrante[]>;
    private obtenerCorreo;
    private extraerTexto;
    responder(params: {
        messageId: string;
        threadId: string;
        para: string;
        asunto: string;
        cuerpo: string;
    }): Promise<void>;
    marcarComoLeido(messageId: string): Promise<void>;
}
