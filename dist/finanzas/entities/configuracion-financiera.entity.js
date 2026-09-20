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
exports.ConfiguracionFinanciera = void 0;
const typeorm_1 = require("typeorm");
const numeric_transformer_1 = require("../../common/transformers/numeric.transformer");
let ConfiguracionFinanciera = class ConfiguracionFinanciera {
    id;
    porcentajeImpuesto;
    updatedAt;
};
exports.ConfiguracionFinanciera = ConfiguracionFinanciera;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ default: 1 }),
    __metadata("design:type", Number)
], ConfiguracionFinanciera.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', {
        name: 'porcentaje_impuesto',
        precision: 5,
        scale: 2,
        transformer: numeric_transformer_1.numericTransformer,
    }),
    __metadata("design:type", Number)
], ConfiguracionFinanciera.prototype, "porcentajeImpuesto", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ConfiguracionFinanciera.prototype, "updatedAt", void 0);
exports.ConfiguracionFinanciera = ConfiguracionFinanciera = __decorate([
    (0, typeorm_1.Entity)('configuracion_financiera')
], ConfiguracionFinanciera);
//# sourceMappingURL=configuracion-financiera.entity.js.map