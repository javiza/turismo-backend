import { ConfigService } from '@nestjs/config';
export interface ImagenSubida {
    url: string;
    publicId: string;
    ancho: number;
    alto: number;
    bytes: number;
}
export declare class CloudinaryService {
    private readonly config;
    private readonly logger;
    private readonly configured;
    constructor(config: ConfigService);
    validarArchivo(file: Express.Multer.File | undefined): void;
    subirImagen(file: Express.Multer.File, carpeta: 'destinos' | 'paquetes' | 'ofertas' | 'contenido' | 'noticias' | 'proveedores'): Promise<ImagenSubida>;
    validarArchivoFuente(file: Express.Multer.File | undefined): void;
    subirFuente(file: Express.Multer.File): Promise<{
        url: string;
        publicId: string;
    }>;
    eliminarImagen(publicId: string): Promise<void>;
}
