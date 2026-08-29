import { Paquete } from '../../paquetes/entities/paquete.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Destino } from '../../destinos/entities/destino.entity';
import { Noticia } from '../../noticias/entities/noticia.entity';
export declare enum EstadoCotizacion {
    PENDIENTE = "PENDIENTE",
    RESPONDIDA = "RESPONDIDA",
    CERRADA = "CERRADA"
}
export declare class Cotizacion {
    id: number;
    paqueteId?: number;
    paquete?: Paquete;
    clienteId?: number;
    cliente?: Cliente;
    destinoId?: number;
    destino?: Destino;
    noticiaId?: number;
    noticia?: Noticia;
    nombre: string;
    email: string;
    telefono?: string;
    cantidadPersonas: number;
    mensaje?: string;
    estado: EstadoCotizacion;
    respuesta?: string;
    respondidoEn?: Date;
    leida: boolean;
    createdAt: Date;
}
