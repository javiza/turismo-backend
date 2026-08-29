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
exports.Proveedor = void 0;
const typeorm_1 = require("typeorm");
let Proveedor = class Proveedor {
    id;
    nombreNegocio;
    rubro;
    nombreContacto;
    correo;
    telefono;
    direccion;
    descripcion;
    imagenUrl;
    precioReferencial;
    leido;
    createdAt;
};
exports.Proveedor = Proveedor;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Proveedor.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombre_negocio', length: 150 }),
    __metadata("design:type", String)
], Proveedor.prototype, "nombreNegocio", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "rubro", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombre_contacto', length: 150 }),
    __metadata("design:type", String)
], Proveedor.prototype, "nombreContacto", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    __metadata("design:type", String)
], Proveedor.prototype, "correo", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Proveedor.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Proveedor.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'imagen_url', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "imagenUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'precio_referencial',
        type: 'numeric',
        precision: 12,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Proveedor.prototype, "precioReferencial", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Proveedor.prototype, "leido", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Proveedor.prototype, "createdAt", void 0);
exports.Proveedor = Proveedor = __decorate([
    (0, typeorm_1.Entity)('proveedores')
], Proveedor);
//# sourceMappingURL=proveedor.entity.js.map