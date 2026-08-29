export declare enum TipoSlide {
    DESTINO = "destino",
    PAQUETE = "paquete",
    OFERTA = "oferta",
    NOTICIA = "noticia"
}
export declare class HomeSlide {
    id: number;
    tipo: TipoSlide;
    referenciaId: number;
    orden: number;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
}
