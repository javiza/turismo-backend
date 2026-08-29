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
exports.AnalyticsEvento = void 0;
const typeorm_1 = require("typeorm");
const destino_entity_1 = require("../../destinos/entities/destino.entity");
const paquete_entity_1 = require("../../paquetes/entities/paquete.entity");
let AnalyticsEvento = class AnalyticsEvento {
    id;
    tipoEvento;
    destinoId;
    destino;
    paqueteId;
    paquete;
    metadata;
    createdAt;
};
exports.AnalyticsEvento = AnalyticsEvento;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AnalyticsEvento.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_evento', length: 100 }),
    __metadata("design:type", String)
], AnalyticsEvento.prototype, "tipoEvento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'destino_id', nullable: true }),
    __metadata("design:type", Number)
], AnalyticsEvento.prototype, "destinoId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => destino_entity_1.Destino, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'destino_id' }),
    __metadata("design:type", destino_entity_1.Destino)
], AnalyticsEvento.prototype, "destino", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paquete_id', nullable: true }),
    __metadata("design:type", Number)
], AnalyticsEvento.prototype, "paqueteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => paquete_entity_1.Paquete, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'paquete_id' }),
    __metadata("design:type", paquete_entity_1.Paquete)
], AnalyticsEvento.prototype, "paquete", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], AnalyticsEvento.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AnalyticsEvento.prototype, "createdAt", void 0);
exports.AnalyticsEvento = AnalyticsEvento = __decorate([
    (0, typeorm_1.Entity)('analytics_eventos')
], AnalyticsEvento);
//# sourceMappingURL=analytics-evento.entity.js.map