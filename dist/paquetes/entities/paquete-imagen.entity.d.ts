import { Paquete } from './paquete.entity';
export declare class PaqueteImagen {
    id: number;
    paqueteId: number;
    paquete: Paquete;
    url: string;
    esPrincipal: boolean;
    createdAt: Date;
}
