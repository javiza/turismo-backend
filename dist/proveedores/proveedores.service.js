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
exports.ProveedoresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const proveedor_entity_1 = require("./entities/proveedor.entity");
const email_service_1 = require("../email/email.service");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
let ProveedoresService = class ProveedoresService {
    proveedorRepository;
    emailService;
    whatsappService;
    constructor(proveedorRepository, emailService, whatsappService) {
        this.proveedorRepository = proveedorRepository;
        this.emailService = emailService;
        this.whatsappService = whatsappService;
    }
    async create(dto) {
        const proveedor = this.proveedorRepository.create({
            ...dto,
            leido: false,
        });
        const guardado = await this.proveedorRepository.save(proveedor);
        void this.emailService.notificarProveedorNuevo({
            nombreNegocio: guardado.nombreNegocio,
            rubro: guardado.rubro,
            nombreContacto: guardado.nombreContacto,
            correo: guardado.correo,
            telefono: guardado.telefono,
            direccion: guardado.direccion,
            descripcion: guardado.descripcion,
            precioReferencial: guardado.precioReferencial,
        });
        void this.whatsappService.notificarProveedorNuevo({
            nombreNegocio: guardado.nombreNegocio,
            rubro: guardado.rubro,
            nombreContacto: guardado.nombreContacto,
            correo: guardado.correo,
            telefono: guardado.telefono,
        });
        return guardado;
    }
    async findAll() {
        return this.proveedorRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const proveedor = await this.proveedorRepository.findOne({
            where: { id },
        });
        if (!proveedor) {
            throw new common_1.NotFoundException('Proveedor no encontrado');
        }
        return proveedor;
    }
    async update(id, dto) {
        const proveedor = await this.findOne(id);
        proveedor.leido = dto.leido;
        return this.proveedorRepository.save(proveedor);
    }
    async remove(id) {
        const proveedor = await this.findOne(id);
        await this.proveedorRepository.remove(proveedor);
    }
    async contarNoLeidos() {
        const count = await this.proveedorRepository.count({
            where: { leido: false },
        });
        return { count };
    }
};
exports.ProveedoresService = ProveedoresService;
exports.ProveedoresService = ProveedoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(proveedor_entity_1.Proveedor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        email_service_1.EmailService,
        whatsapp_service_1.WhatsappService])
], ProveedoresService);
//# sourceMappingURL=proveedores.service.js.map