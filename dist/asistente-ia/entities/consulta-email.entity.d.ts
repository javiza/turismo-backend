export declare enum EstadoConsultaEmail {
    RESPONDIDA_IA = "RESPONDIDA_IA",
    ESCALADA = "ESCALADA",
    ERROR = "ERROR"
}
export declare class ConsultaEmail {
    id: number;
    gmailMessageId: string;
    gmailThreadId: string;
    remitente: string;
    asunto?: string;
    cuerpoOriginal: string;
    respuesta?: string;
    estado: EstadoConsultaEmail;
    detalle?: string;
    createdAt: Date;
}
