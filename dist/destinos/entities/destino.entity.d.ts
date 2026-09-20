import { Categoria } from '../../categorias/entities/categoria.entity';
import { DestinoImagen } from './destino-imagen.entity';
export declare class Destino {
    id: number;
    nombre: string;
    descripcion: string;
    pais: string;
    ciudad: string;
    latitud?: number;
    longitud?: number;
    imagenPrincipal?: string;
    precioDesde?: number;
    activo: boolean;
    fechaInicio?: string;
    fechaFin?: string;
    createdAt: Date;
    updatedAt: Date;
    categorias?: Categoria[];
    imagenes?: DestinoImagen[];
}
