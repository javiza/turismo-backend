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
exports.Oferta = void 0;
const typeorm_1 = require("typeorm");
const paquete_entity_1 = require("../../paquetes/entities/paquete.entity");
const numeric_transformer_1 = require("../../common/transformers/numeric.transformer");
const oferta_imagen_entity_1 = require("./oferta-imagen.entity");
let Oferta = class Oferta {
    id;
    paqueteId;
    paquete;
    titulo;
    descripcion;
    descuento;
    fechaInicio;
    fechaFin;
    activa;
    fechaDesactivacion;
    imagenPrincipal;
    imagenes;
    createdAt;
};
exports.Oferta = Oferta;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Oferta.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paquete_id' }),
    __metadata("design:type", Number)
], Oferta.prototype, "paqueteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => paquete_entity_1.Paquete, { onDelete: 'CASCADE', nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'paquete_id' }),
    __metadata("design:type", paquete_entity_1.Paquete)
], Oferta.prototype, "paquete", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Oferta.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Oferta.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', {
        precision: 5,
        scale: 2,
        transformer: numeric_transformer_1.numericTransformer,
    }),
    __metadata("design:type", Number)
], Oferta.prototype, "descuento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_inicio', type: 'date' }),
    __metadata("design:type", String)
], Oferta.prototype, "fechaInicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_fin', type: 'date' }),
    __metadata("design:type", String)
], Oferta.prototype, "fechaFin", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Oferta.prototype, "activa", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', { name: 'fecha_desactivacion', nullable: true }),
    __metadata("design:type", Object)
], Oferta.prototype, "fechaDesactivacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'imagen_principal', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Oferta.prototype, "imagenPrincipal", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => oferta_imagen_entity_1.OfertaImagen, (imagen) => imagen.oferta),
    __metadata("design:type", Array)
], Oferta.prototype, "imagenes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Oferta.prototype, "createdAt", void 0);
exports.Oferta = Oferta = __decorate([
    (0, typeorm_1.Entity)('ofertas')
], Oferta);
//# sourceMappingURL=oferta.entity.js.map