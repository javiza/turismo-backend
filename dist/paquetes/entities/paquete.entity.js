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
exports.Paquete = void 0;
const typeorm_1 = require("typeorm");
const destino_entity_1 = require("../../destinos/entities/destino.entity");
const numeric_transformer_1 = require("../../common/transformers/numeric.transformer");
const paquete_imagen_entity_1 = require("./paquete-imagen.entity");
let Paquete = class Paquete {
    id;
    destinoId;
    destino;
    nombre;
    descripcion;
    precio;
    precioAnterior;
    cupos;
    fechaInicio;
    fechaFin;
    activo;
    fechaDesactivacion;
    imagenPrincipal;
    imagenes;
    createdAt;
    updatedAt;
};
exports.Paquete = Paquete;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Paquete.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'destino_id' }),
    __metadata("design:type", Number)
], Paquete.prototype, "destinoId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => destino_entity_1.Destino, { onDelete: 'RESTRICT', nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'destino_id' }),
    __metadata("design:type", destino_entity_1.Destino)
], Paquete.prototype, "destino", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Paquete.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Paquete.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', {
        precision: 12,
        scale: 2,
        transformer: numeric_transformer_1.numericTransformer,
    }),
    __metadata("design:type", Number)
], Paquete.prototype, "precio", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', {
        name: 'precio_anterior',
        precision: 12,
        scale: 2,
        nullable: true,
        transformer: numeric_transformer_1.numericTransformer,
    }),
    __metadata("design:type", Number)
], Paquete.prototype, "precioAnterior", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Paquete.prototype, "cupos", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_inicio', type: 'date' }),
    __metadata("design:type", String)
], Paquete.prototype, "fechaInicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_fin', type: 'date' }),
    __metadata("design:type", String)
], Paquete.prototype, "fechaFin", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Paquete.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', { name: 'fecha_desactivacion', nullable: true }),
    __metadata("design:type", Object)
], Paquete.prototype, "fechaDesactivacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'imagen_principal', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Paquete.prototype, "imagenPrincipal", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => paquete_imagen_entity_1.PaqueteImagen, (imagen) => imagen.paquete),
    __metadata("design:type", Array)
], Paquete.prototype, "imagenes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Paquete.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Paquete.prototype, "updatedAt", void 0);
exports.Paquete = Paquete = __decorate([
    (0, typeorm_1.Entity)('paquetes')
], Paquete);
//# sourceMappingURL=paquete.entity.js.map