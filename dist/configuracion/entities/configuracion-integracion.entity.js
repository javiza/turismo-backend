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
exports.ConfiguracionIntegracion = exports.ClaveIntegracion = void 0;
const typeorm_1 = require("typeorm");
var ClaveIntegracion;
(function (ClaveIntegracion) {
    ClaveIntegracion["SMTP"] = "smtp";
    ClaveIntegracion["WHATSAPP"] = "whatsapp";
    ClaveIntegracion["TRANSBANK"] = "transbank";
    ClaveIntegracion["MERCADOPAGO"] = "mercadopago";
})(ClaveIntegracion || (exports.ClaveIntegracion = ClaveIntegracion = {}));
let ConfiguracionIntegracion = class ConfiguracionIntegracion {
    id;
    clave;
    valorCifrado;
    actualizadoPorId;
    createdAt;
    updatedAt;
};
exports.ConfiguracionIntegracion = ConfiguracionIntegracion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ConfiguracionIntegracion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ClaveIntegracion, unique: true }),
    __metadata("design:type", String)
], ConfiguracionIntegracion.prototype, "clave", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'valor_cifrado', type: 'text' }),
    __metadata("design:type", String)
], ConfiguracionIntegracion.prototype, "valorCifrado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actualizado_por_id', nullable: true }),
    __metadata("design:type", Number)
], ConfiguracionIntegracion.prototype, "actualizadoPorId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ConfiguracionIntegracion.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ConfiguracionIntegracion.prototype, "updatedAt", void 0);
exports.ConfiguracionIntegracion = ConfiguracionIntegracion = __decorate([
    (0, typeorm_1.Entity)('configuraciones_integracion')
], ConfiguracionIntegracion);
//# sourceMappingURL=configuracion-integracion.entity.js.map