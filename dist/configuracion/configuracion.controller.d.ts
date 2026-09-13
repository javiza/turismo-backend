import { ConfiguracionService } from './configuracion.service';
import { ActualizarSmtpDto, ActualizarWhatsappDto, ActualizarTransbankDto, ActualizarMercadoPagoDto } from './dto/configuracion.dto';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class ConfiguracionController {
    private readonly service;
    constructor(service: ConfiguracionService);
    obtenerSmtp(): Promise<{
        configuradoEnDb: boolean;
        actualizadoEn?: Date;
        password: string;
        configurado: boolean;
        host: string;
        port: number;
        user: string;
        from: string;
        adminEmail: string;
    }>;
    actualizarSmtp(dto: ActualizarSmtpDto, user: JwtPayload): Promise<{
        message: string;
    }>;
    obtenerWhatsapp(): Promise<{
        configuradoEnDb: boolean;
        actualizadoEn?: Date;
        token: string;
        configurado: boolean;
        phoneNumberId: string;
        adminNumber: string;
        apiVersion: string;
    }>;
    actualizarWhatsapp(dto: ActualizarWhatsappDto, user: JwtPayload): Promise<{
        message: string;
    }>;
    obtenerTransbank(): Promise<{
        configuradoEnDb: boolean;
        actualizadoEn?: Date;
        apiKey: string;
        configurado: boolean;
        commerceCode: string;
        environment: "integration" | "production";
    }>;
    actualizarTransbank(dto: ActualizarTransbankDto, user: JwtPayload): Promise<{
        message: string;
    }>;
    obtenerMercadoPago(): Promise<{
        configuradoEnDb: boolean;
        actualizadoEn?: Date;
        accessToken: string;
        configurado: boolean;
        publicKey: string;
    }>;
    actualizarMercadoPago(dto: ActualizarMercadoPagoDto, user: JwtPayload): Promise<{
        message: string;
    }>;
}
