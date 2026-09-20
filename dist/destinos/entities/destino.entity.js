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
exports.Destino = void 0;
const typeorm_1 = require("typeorm");
const numeric_transformer_1 = require("../../common/transformers/numeric.transformer");
const categoria_entity_1 = require("../../categorias/entities/categoria.entity");
const destino_imagen_entity_1 = require("./destino-imagen.entity");
let Destino = class Destino {
    id;
    nombre;
    descripcion;
    pais;
    ciudad;
    latitud;
    longitud;
    imagenPrincipal;
    precioDesde;
    activo;
    fechaInicio;
    fechaFin;
    createdAt;
    updatedAt;
    categorias;
    imagenes;
};
exports.Destino = Destino;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Destino.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Destino.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Destino.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Destino.prototype, "pais", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Destino.prototype, "ciudad", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', {
        precision: 10,
        scale: 6,
        nullable: true,
        transformer: numeric_transformer_1.numericTransformer,
    }),
    __metadata("design:type", Number)
], Destino.prototype, "latitud", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', {
        precision: 10,
        scale: 6,
        nullable: true,
        transformer: numeric_transformer_1.numericTransformer,
    }),
    __metadata("design:type", Number)
], Destino.prototype, "longitud", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'imagen_principal', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Destino.prototype, "imagenPrincipal", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', {
        name: 'precio_desde',
        precision: 12,
        scale: 2,
        nullable: true,
        transformer: numeric_transformer_1.numericTransformer,
    }),
    __metadata("design:type", Number)
], Destino.prototype, "precioDesde", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Destino.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_inicio', type: 'date', nullable: true }),
    __metadata("design:type", String)
], Destino.prototype, "fechaInicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_fin', type: 'date', nullable: true }),
    __metadata("design:type", String)
], Destino.prototype, "fechaFin", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Destino.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Destino.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => categoria_entity_1.Categoria, (categoria) => categoria.destinos),
    (0, typeorm_1.JoinTable)({
        name: 'destino_categoria',
        joinColumn: { name: 'destino_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'categoria_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Destino.prototype, "categorias", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => destino_imagen_entity_1.DestinoImagen, (imagen) => imagen.destino),
    __metadata("design:type", Array)
], Destino.prototype, "imagenes", void 0);
exports.Destino = Destino = __decorate([
    (0, typeorm_1.Entity)('destinos')
], Destino);
//# sourceMappingURL=destino.entity.js.map