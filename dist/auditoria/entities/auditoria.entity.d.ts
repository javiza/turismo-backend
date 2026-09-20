export declare enum AccionAuditoria {
    INSERT = "INSERT",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}
export declare class Auditoria {
    id: number;
    tabla: string;
    accion: AccionAuditoria;
    registroId?: number;
    usuarioId?: number;
    datosAnteriores?: Record<string, unknown>;
    datosNuevos?: Record<string, unknown>;
    createdAt: Date;
}
