import { CloudinaryService } from './cloudinary.service';
declare enum CarpetaUpload {
    destinos = "destinos",
    paquetes = "paquetes",
    ofertas = "ofertas",
    contenido = "contenido",
    noticias = "noticias"
}
export declare class UploadsController {
    private readonly cloudinary;
    constructor(cloudinary: CloudinaryService);
    subir(carpeta: CarpetaUpload, archivo: Express.Multer.File): Promise<import("./cloudinary.service").ImagenSubida>;
    subirFuente(archivo: Express.Multer.File): Promise<{
        url: string;
        publicId: string;
    }>;
}
export {};
