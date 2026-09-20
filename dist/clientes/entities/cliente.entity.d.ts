export declare class Cliente {
    id: number;
    nombre: string;
    email: string;
    password: string;
    telefono?: string;
    telefonosAdicionales: string[];
    correosAdicionales: string[];
    rut?: string;
    activo: boolean;
    hashedRefreshToken: string | null;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
