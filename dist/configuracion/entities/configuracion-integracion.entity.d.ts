export declare enum ClaveIntegracion {
    SMTP = "smtp",
    WHATSAPP = "whatsapp",
    TRANSBANK = "transbank",
    MERCADOPAGO = "mercadopago"
}
export declare class ConfiguracionIntegracion {
    id: number;
    clave: ClaveIntegracion;
    valorCifrado: string;
    actualizadoPorId?: number;
    createdAt: Date;
    updatedAt: Date;
}
