import { Destino } from '../../destinos/entities/destino.entity';
export declare class Categoria {
    id: number;
    nombre: string;
    descripcion?: string;
    destinos?: Destino[];
}
