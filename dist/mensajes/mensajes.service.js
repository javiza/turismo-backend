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
exports.MensajesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mensaje_entity_1 = require("./entities/mensaje.entity");
const email_service_1 = require("../email/email.service");
let MensajesService = class MensajesService {
    mensajeRepository;
    emailService;
    constructor(mensajeRepository, emailService) {
        this.mensajeRepository = mensajeRepository;
        this.emailService = emailService;
    }
    async create(dto) {
        const mensaje = this.mensajeRepository.create({
            ...dto,
            leido: false,
        });
        const guardado = await this.mensajeRepository.save(mensaje);
        void this.emailService.notificarNuevoMensaje({
            nombre: guardado.nombre,
            correo: guardado.correo,
            asunto: guardado.asunto,
            mensaje: guardado.mensaje,
        });
        return guardado;
    }
    async findAll() {
        return this.mensajeRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const mensaje = await this.mensajeRepository.findOne({ where: { id } });
        if (!mensaje) {
            throw new common_1.NotFoundException('Mensaje no encontrado');
        }
        return mensaje;
    }
    async update(id, dto) {
        const mensaje = await this.findOne(id);
        mensaje.leido = dto.leido;
        return this.mensajeRepository.save(mensaje);
    }
    async remove(id) {
        const mensaje = await this.findOne(id);
        await this.mensajeRepository.remove(mensaje);
    }
};
exports.MensajesService = MensajesService;
exports.MensajesService = MensajesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(mensaje_entity_1.Mensaje)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        email_service_1.EmailService])
], MensajesService);
//# sourceMappingURL=mensajes.service.js.map