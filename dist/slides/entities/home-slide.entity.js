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
exports.HomeSlide = exports.TipoSlide = void 0;
const typeorm_1 = require("typeorm");
var TipoSlide;
(function (TipoSlide) {
    TipoSlide["DESTINO"] = "destino";
    TipoSlide["PAQUETE"] = "paquete";
    TipoSlide["OFERTA"] = "oferta";
    TipoSlide["NOTICIA"] = "noticia";
})(TipoSlide || (exports.TipoSlide = TipoSlide = {}));
let HomeSlide = class HomeSlide {
    id;
    tipo;
    referenciaId;
    orden;
    activo;
    createdAt;
    updatedAt;
};
exports.HomeSlide = HomeSlide;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HomeSlide.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TipoSlide }),
    __metadata("design:type", String)
], HomeSlide.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referencia_id' }),
    __metadata("design:type", Number)
], HomeSlide.prototype, "referenciaId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], HomeSlide.prototype, "orden", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], HomeSlide.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], HomeSlide.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], HomeSlide.prototype, "updatedAt", void 0);
exports.HomeSlide = HomeSlide = __decorate([
    (0, typeorm_1.Entity)('home_slides')
], HomeSlide);
//# sourceMappingURL=home-slide.entity.js.map