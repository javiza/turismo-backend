import { Destino } from '../../destinos/entities/destino.entity';
import { PaqueteImagen } from './paquete-imagen.entity';
export declare class Paquete {
    id: number;
    destinoId: number;
    destino: Destino;
    nombre: string;
    descripcion: string;
    precio: number;
    precioAnterior?: number;
    cupos: number;
    fechaInicio: string;
    fechaFin: string;
    activo: boolean;
    fechaDesactivacion?: Date | null;
    imagenPrincipal?: string;
    imagenes?: PaqueteImagen[];
    createdAt: Date;
    updatedAt: Date;
}
