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
exports.VisitasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const visita_entity_1 = require("./entities/visita.entity");
let VisitasService = class VisitasService {
    visitaRepository;
    constructor(visitaRepository) {
        this.visitaRepository = visitaRepository;
    }
    async registrar(dto, meta) {
        if (!dto.destinoId && !dto.paqueteId) {
            throw new common_1.BadRequestException('Debes indicar destinoId o paqueteId para registrar la visita');
        }
        const visita = this.visitaRepository.create({
            destino: dto.destinoId ? { id: dto.destinoId } : undefined,
            paquete: dto.paqueteId ? { id: dto.paqueteId } : undefined,
            ip: meta.ip,
            userAgent: meta.userAgent,
        });
        try {
            await this.visitaRepository.save(visita);
        }
        catch (error) {
            if (error instanceof typeorm_2.QueryFailedError &&
                error.code === '23503') {
                return;
            }
            throw error;
        }
    }
};
exports.VisitasService = VisitasService;
exports.VisitasService = VisitasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(visita_entity_1.Visita)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VisitasService);
//# sourceMappingURL=visitas.service.js.map