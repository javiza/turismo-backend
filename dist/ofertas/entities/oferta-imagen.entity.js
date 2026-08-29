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
exports.OfertaImagen = void 0;
const typeorm_1 = require("typeorm");
const oferta_entity_1 = require("./oferta.entity");
let OfertaImagen = class OfertaImagen {
    id;
    ofertaId;
    oferta;
    url;
    esPrincipal;
    createdAt;
};
exports.OfertaImagen = OfertaImagen;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OfertaImagen.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'oferta_id' }),
    __metadata("design:type", Number)
], OfertaImagen.prototype, "ofertaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => oferta_entity_1.Oferta, { onDelete: 'CASCADE', nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'oferta_id' }),
    __metadata("design:type", oferta_entity_1.Oferta)
], OfertaImagen.prototype, "oferta", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], OfertaImagen.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'es_principal', default: false }),
    __metadata("design:type", Boolean)
], OfertaImagen.prototype, "esPrincipal", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], OfertaImagen.prototype, "createdAt", void 0);
exports.OfertaImagen = OfertaImagen = __decorate([
    (0, typeorm_1.Entity)('oferta_imagenes')
], OfertaImagen);
//# sourceMappingURL=oferta-imagen.entity.js.map