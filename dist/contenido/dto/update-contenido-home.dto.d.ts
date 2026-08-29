export declare const FUENTES_SLOGAN_KEYS: readonly ["caveat", "dancing-script", "pacifico", "sacramento", "shadows-into-light"];
declare class ResenaHomeDto {
    nombre: string;
    texto: string;
    valoracion?: number;
}
export declare class UpdateContenidoHomeDto {
    nombreAgencia?: string;
    logoUrl?: string;
    sloganColor?: string;
    sloganFontFamily?: string;
    sloganFontUrl?: string;
    colorFondo?: string;
    colorNavbar?: string;
    titulo?: string;
    subtitulo?: string;
    presentacion?: string;
    mision?: string;
    vision?: string;
    valores?: string;
    resenas?: ResenaHomeDto[];
    telefono?: string;
    correo?: string;
    direccion?: string;
    heroImagenUrl?: string;
    heroImagenPosX?: number;
    heroImagenPosY?: number;
    heroImagenZoom?: number;
}
export {};
