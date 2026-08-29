import { User } from '../../users/entities/user.entity';
export declare class Noticia {
    id: number;
    titulo: string;
    contenido: string;
    imagenUrl?: string;
    activa: boolean;
    autorId?: number;
    autor?: User;
    createdAt: Date;
    updatedAt: Date;
}
