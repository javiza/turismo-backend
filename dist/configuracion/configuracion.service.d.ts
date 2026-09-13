import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { ConfiguracionIntegracion, ClaveIntegracion } from './entities/configuracion-integracion.entity';
export interface ConfigSmtp {
    host: string;
    port: number;
    user: string;
    password: string;
    from: string;
    adminEmail: string;
}
export interface ConfigWhatsapp {
    token: string;
    phoneNumberId: string;
    adminNumber: string;
    apiVersion: string;
}
export interface ConfigTransbank {
    commerceCode: string;
    apiKey: string;
    environment: 'integration' | 'production';
}
export interface ConfigMercadoPago {
    accessToken: string;
    publicKey: string;
}
export declare class ConfiguracionService {
    private readonly repo;
    private readonly env;
    private readonly logger;
    constructor(repo: Repository<ConfiguracionIntegracion>, env: ConfigService);
    private obtenerJson;
    guardar<T>(clave: ClaveIntegracion, data: T, adminId?: number): Promise<void>;
    obtenerEstado(clave: ClaveIntegracion): Promise<{
        configuradoEnDb: boolean;
        actualizadoEn?: Date;
    }>;
    obtenerSmtp(): Promise<ConfigSmtp>;
    obtenerWhatsapp(): Promise<ConfigWhatsapp>;
    obtenerTransbank(): Promise<ConfigTransbank>;
    obtenerMercadoPago(): Promise<ConfigMercadoPago>;
}
