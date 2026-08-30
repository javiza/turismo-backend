export interface ResenaHome {
    nombre: string;
    texto: string;
    valoracion?: number;
}
export declare class ContenidoHome {
    id: number;
    nombreAgencia: string;
    logoUrl: string | null;
    sloganColor: string;
    sloganFontFamily: string;
    sloganFontUrl: string | null;
    colorFondo: string | null;
    colorNavbar: string | null;
    colorFooter: string | null;
    titulo: string;
    subtitulo: string;
    presentacion: string;
    mision: string;
    vision: string;
    valores: string;
    resenas: ResenaHome[];
    telefono: string | null;
    correo: string | null;
    direccion: string | null;
    heroImagenUrl: string | null;
    heroImagenPosX: number;
    heroImagenPosY: number;
    heroImagenZoom: number;
    updatedAt: Date;
}
