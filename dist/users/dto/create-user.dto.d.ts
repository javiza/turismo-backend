import { UserRole } from '../entities/user.entity';
export declare class CreateUserDto {
    nombre: string;
    email: string;
    password: string;
    rol?: UserRole;
    rut?: string;
}
