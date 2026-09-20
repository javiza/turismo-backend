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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visita = void 0;
const typeorm_1 = require("typeorm");
const destino_entity_1 = require("../../destinos/entities/destino.entity");
const paquete_entity_1 = require("../../paquetes/entities/paquete.entity");
let Visita = class Visita {
    id;
    destinoId;
    destino;
    paqueteId;
    paquete;
    ip;
    pais;
    ciudad;
    userAgent;
    createdAt;
};
exports.Visita = Visita;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Visita.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'destino_id', nullable: true }),
    __metadata("design:type", Number)
], Visita.prototype, "destinoId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => destino_entity_1.Destino, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'destino_id' }),
    __metadata("design:type", destino_entity_1.Destino)
], Visita.prototype, "destino", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paquete_id', nullable: true }),
    __metadata("design:type", Number)
], Visita.prototype, "paqueteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => paquete_entity_1.Paquete, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'paquete_id' }),
    __metadata("design:type", paquete_entity_1.Paquete)
], Visita.prototype, "paquete", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Visita.prototype, "ip", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Visita.prototype, "pais", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Visita.prototype, "ciudad", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_agent', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Visita.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Visita.prototype, "createdAt", void 0);
exports.Visita = Visita = __decorate([
    (0, typeorm_1.Entity)('visitas')
], Visita);
//# sourceMappingURL=visita.entity.js.map