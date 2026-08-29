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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContenidoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contenido_home_entity_1 = require("./entities/contenido-home.entity");
const SINGLETON_ID = 1;
let ContenidoService = class ContenidoService {
    contenidoRepository;
    constructor(contenidoRepository) {
        this.contenidoRepository = contenidoRepository;
    }
    async obtener() {
        const existente = await this.contenidoRepository.findOne({
            where: { id: SINGLETON_ID },
        });
        if (existente) {
            return existente;
        }
        const nuevo = this.contenidoRepository.create({
            id: SINGLETON_ID,
            nombreAgencia: 'Tu Agencia de Viajes',
            logoUrl: null,
            sloganColor: '#c2410c',
            sloganFontFamily: 'caveat',
            sloganFontUrl: null,
            colorFondo: null,
            colorNavbar: null,
            titulo: 'Programa tus vacaciones con nosotros',
            subtitulo: 'Arma tu próximo viaje con destinos, paquetes y ofertas curadas por nuestro equipo — todo reservable en minutos.',
            presentacion: '',
            mision: '',
            vision: '',
            valores: '',
            resenas: [],
            telefono: null,
            correo: null,
            direccion: null,
            heroImagenUrl: null,
            heroImagenPosX: 50,
            heroImagenPosY: 50,
            heroImagenZoom: 100,
        });
        return this.contenidoRepository.save(nuevo);
    }
    async actualizar(dto) {
        const contenido = await this.obtener();
        Object.assign(contenido, dto);
        return this.contenidoRepository.save(contenido);
    }
};
exports.ContenidoService = ContenidoService;
exports.ContenidoService = ContenidoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contenido_home_entity_1.ContenidoHome)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ContenidoService);
//# sourceMappingURL=contenido.service.js.map