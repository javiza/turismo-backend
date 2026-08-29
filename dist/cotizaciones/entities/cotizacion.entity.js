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
exports.Cotizacion = exports.EstadoCotizacion = void 0;
const typeorm_1 = require("typeorm");
const paquete_entity_1 = require("../../paquetes/entities/paquete.entity");
const cliente_entity_1 = require("../../clientes/entities/cliente.entity");
const destino_entity_1 = require("../../destinos/entities/destino.entity");
const noticia_entity_1 = require("../../noticias/entities/noticia.entity");
var EstadoCotizacion;
(function (EstadoCotizacion) {
    EstadoCotizacion["PENDIENTE"] = "PENDIENTE";
    EstadoCotizacion["RESPONDIDA"] = "RESPONDIDA";
    EstadoCotizacion["CERRADA"] = "CERRADA";
})(EstadoCotizacion || (exports.EstadoCotizacion = EstadoCotizacion = {}));
let Cotizacion = class Cotizacion {
    id;
    paqueteId;
    paquete;
    clienteId;
    cliente;
    destinoId;
    destino;
    noticiaId;
    noticia;
    nombre;
    email;
    telefono;
    cantidadPersonas;
    mensaje;
    estado;
    respuesta;
    respondidoEn;
    leida;
    createdAt;
};
exports.Cotizacion = Cotizacion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Cotizacion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paquete_id', nullable: true }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "paqueteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => paquete_entity_1.Paquete, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'paquete_id' }),
    __metadata("design:type", paquete_entity_1.Paquete)
], Cotizacion.prototype, "paquete", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cliente_id', nullable: true }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "clienteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cliente_entity_1.Cliente, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'cliente_id' }),
    __metadata("design:type", cliente_entity_1.Cliente)
], Cotizacion.prototype, "cliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'destino_id', nullable: true }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "destinoId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => destino_entity_1.Destino, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'destino_id' }),
    __metadata("design:type", destino_entity_1.Destino)
], Cotizacion.prototype, "destino", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'noticia_id', nullable: true }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "noticiaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => noticia_entity_1.Noticia, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'noticia_id' }),
    __metadata("design:type", noticia_entity_1.Noticia)
], Cotizacion.prototype, "noticia", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    __metadata("design:type", String)
], Cotizacion.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    __metadata("design:type", String)
], Cotizacion.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Cotizacion.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cantidad_personas', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "cantidadPersonas", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Cotizacion.prototype, "mensaje", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        default: EstadoCotizacion.PENDIENTE,
    }),
    __metadata("design:type", String)
], Cotizacion.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Cotizacion.prototype, "respuesta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'respondido_en', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Cotizacion.prototype, "respondidoEn", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Cotizacion.prototype, "leida", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Cotizacion.prototype, "createdAt", void 0);
exports.Cotizacion = Cotizacion = __decorate([
    (0, typeorm_1.Entity)('cotizaciones')
], Cotizacion);
//# sourceMappingURL=cotizacion.entity.js.map