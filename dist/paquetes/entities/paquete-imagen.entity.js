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
exports.PaqueteImagen = void 0;
const typeorm_1 = require("typeorm");
const paquete_entity_1 = require("./paquete.entity");
let PaqueteImagen = class PaqueteImagen {
    id;
    paqueteId;
    paquete;
    url;
    esPrincipal;
    createdAt;
};
exports.PaqueteImagen = PaqueteImagen;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PaqueteImagen.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paquete_id' }),
    __metadata("design:type", Number)
], PaqueteImagen.prototype, "paqueteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => paquete_entity_1.Paquete, { onDelete: 'CASCADE', nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'paquete_id' }),
    __metadata("design:type", paquete_entity_1.Paquete)
], PaqueteImagen.prototype, "paquete", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], PaqueteImagen.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'es_principal', default: false }),
    __metadata("design:type", Boolean)
], PaqueteImagen.prototype, "esPrincipal", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PaqueteImagen.prototype, "createdAt", void 0);
exports.PaqueteImagen = PaqueteImagen = __decorate([
    (0, typeorm_1.Entity)('paquete_imagenes')
], PaqueteImagen);
//# sourceMappingURL=paquete-imagen.entity.js.map