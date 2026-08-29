import { Paquete } from '../../paquetes/entities/paquete.entity';
import { OfertaImagen } from './oferta-imagen.entity';
export declare class Oferta {
    id: number;
    paqueteId: number;
    paquete: Paquete;
    titulo: string;
    descripcion?: string;
    descuento: number;
    fechaInicio: string;
    fechaFin: string;
    activa: boolean;
    fechaDesactivacion?: Date | null;
    imagenPrincipal?: string;
    imagenes?: OfertaImagen[];
    createdAt: Date;
}
