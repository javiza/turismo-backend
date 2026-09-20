import { Oferta } from './oferta.entity';
export declare class OfertaImagen {
    id: number;
    ofertaId: number;
    oferta: Oferta;
    url: string;
    esPrincipal: boolean;
    createdAt: Date;
}
