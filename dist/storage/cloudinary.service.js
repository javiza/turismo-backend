"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CloudinaryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
const TIPOS_PERMITIDOS = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
];
const TAMANO_MAXIMO_BYTES = 5 * 1024 * 1024;
const EXTENSIONES_FUENTE_PERMITIDAS = ['.ttf', '.otf', '.woff', '.woff2'];
const TAMANO_MAXIMO_FUENTE_BYTES = 2 * 1024 * 1024;
let CloudinaryService = CloudinaryService_1 = class CloudinaryService {
    config;
    logger = new common_1.Logger(CloudinaryService_1.name);
    configured;
    constructor(config) {
        this.config = config;
        const cloudName = this.config.get('CLOUDINARY_CLOUD_NAME');
        const apiKey = this.config.get('CLOUDINARY_API_KEY');
        const apiSecret = this.config.get('CLOUDINARY_API_SECRET');
        this.configured = Boolean(cloudName && apiKey && apiSecret);
        if (!this.configured) {
            this.logger.warn('Cloudinary no configurado (faltan CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET). ' +
                'El endpoint de subida de imágenes devolverá error hasta configurarlo.');
            return;
        }
        cloudinary_1.v2.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true,
        });
    }
    validarArchivo(file) {
        if (!file) {
            throw new common_1.BadRequestException('No se envió ningún archivo');
        }
        if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`Tipo de archivo no permitido (${file.mimetype}). Usa JPG, PNG, WEBP o AVIF.`);
        }
        if (file.size > TAMANO_MAXIMO_BYTES) {
            throw new common_1.BadRequestException('El archivo supera el máximo de 5 MB');
        }
    }
    async subirImagen(file, carpeta) {
        this.validarArchivo(file);
        if (!this.configured) {
            throw new common_1.InternalServerErrorException('El almacenamiento de imágenes no está configurado en el servidor');
        }
        const resultado = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({
                folder: `turismo/${carpeta}`,
                resource_type: 'image',
                transformation: [{ quality: 'auto', fetch_format: 'auto' }],
            }, (error, result) => {
                if (error || !result) {
                    return reject(error ?? new Error('Cloudinary no devolvió resultado'));
                }
                resolve(result);
            });
            stream.end(file.buffer);
        });
        return {
            url: resultado.secure_url,
            publicId: resultado.public_id,
            ancho: resultado.width,
            alto: resultado.height,
            bytes: resultado.bytes,
        };
    }
    validarArchivoFuente(file) {
        if (!file) {
            throw new common_1.BadRequestException('No se envió ningún archivo');
        }
        const extension = file.originalname
            .slice(file.originalname.lastIndexOf('.'))
            .toLowerCase();
        if (!EXTENSIONES_FUENTE_PERMITIDAS.includes(extension)) {
            throw new common_1.BadRequestException(`Tipo de archivo no permitido (${extension || 'sin extensión'}). Usa TTF, OTF, WOFF o WOFF2.`);
        }
        if (file.size > TAMANO_MAXIMO_FUENTE_BYTES) {
            throw new common_1.BadRequestException('El archivo supera el máximo de 2 MB');
        }
    }
    async subirFuente(file) {
        this.validarArchivoFuente(file);
        if (!this.configured) {
            throw new common_1.InternalServerErrorException('El almacenamiento de archivos no está configurado en el servidor');
        }
        const resultado = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({
                folder: 'turismo/contenido/fuentes',
                resource_type: 'raw',
                public_id: file.originalname.replace(/\s+/g, '_'),
                use_filename: true,
                unique_filename: true,
                overwrite: false,
            }, (error, result) => {
                if (error || !result) {
                    return reject(error ?? new Error('Cloudinary no devolvió resultado'));
                }
                resolve(result);
            });
            stream.end(file.buffer);
        });
        return { url: resultado.secure_url, publicId: resultado.public_id };
    }
    async eliminarImagen(publicId) {
        if (!this.configured) {
            return;
        }
        try {
            await cloudinary_1.v2.uploader.destroy(publicId);
        }
        catch (error) {
            this.logger.warn(`No se pudo eliminar la imagen ${publicId} en Cloudinary: ${error.message}`);
        }
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = CloudinaryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map