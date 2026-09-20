export declare const FUENTES_SLOGAN_KEYS: readonly ["caveat", "dancing-script", "pacifico", "sacramento", "shadows-into-light"];
export declare const FUENTES_SITIO_KEYS: readonly ["inter", "poppins", "roboto", "open-sans", "lato", "montserrat", "nunito", "dm-sans", "fraunces", "playfair-display", "merriweather", "lora"];
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
    colorFooter?: string;
    colorTarjetas?: string;
    faviconUrl?: string;
    fuenteTexto?: string;
    fuenteTextoUrl?: string;
    fuenteTitulos?: string;
    fuenteTitulosUrl?: string;
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
