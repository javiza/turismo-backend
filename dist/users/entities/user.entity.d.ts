export declare enum UserRole {
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}
export declare class User {
    id: number;
    nombre: string;
    email: string;
    password: string;
    rol: UserRole;
    rut?: string;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
    hashedRefreshToken: string | null;
}
