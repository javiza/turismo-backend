import { Destino } from './destino.entity';
export declare class DestinoImagen {
    id: number;
    destinoId: number;
    destino: Destino;
    url: string;
    esPrincipal: boolean;
    createdAt: Date;
}
