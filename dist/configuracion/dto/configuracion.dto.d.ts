export declare class ActualizarSmtpDto {
    host: string;
    port: number;
    user: string;
    password?: string;
    from: string;
    adminEmail: string;
}
export declare class ActualizarWhatsappDto {
    token?: string;
    phoneNumberId: string;
    adminNumber: string;
    apiVersion?: string;
}
export declare class ActualizarTransbankDto {
    commerceCode: string;
    apiKey?: string;
    environment: 'integration' | 'production';
}
export declare class ActualizarMercadoPagoDto {
    accessToken?: string;
    publicKey: string;
}
