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
exports.Reserva = exports.EstadoReserva = void 0;
const typeorm_1 = require("typeorm");
const paquete_entity_1 = require("../../paquetes/entities/paquete.entity");
const cliente_entity_1 = require("../../clientes/entities/cliente.entity");
const numeric_transformer_1 = require("../../common/transformers/numeric.transformer");
var EstadoReserva;
(function (EstadoReserva) {
    EstadoReserva["PENDIENTE"] = "PENDIENTE";
    EstadoReserva["CONFIRMADA"] = "CONFIRMADA";
    EstadoReserva["CANCELADA"] = "CANCELADA";
})(EstadoReserva || (exports.EstadoReserva = EstadoReserva = {}));
let Reserva = class Reserva {
    id;
    paqueteId;
    paquete;
    clienteId;
    cliente;
    nombreCliente;
    emailCliente;
    telefono;
    cantidadPersonas;
    montoTotal;
    estado;
    fechaReserva;
    metodoPago;
    pagadoEn;
};
exports.Reserva = Reserva;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Reserva.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paquete_id' }),
    __metadata("design:type", Number)
], Reserva.prototype, "paqueteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => paquete_entity_1.Paquete, { onDelete: 'RESTRICT', nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'paquete_id' }),
    __metadata("design:type", paquete_entity_1.Paquete)
], Reserva.prototype, "paquete", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cliente_id', nullable: true }),
    __metadata("design:type", Number)
], Reserva.prototype, "clienteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cliente_entity_1.Cliente, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'cliente_id' }),
    __metadata("design:type", cliente_entity_1.Cliente)
], Reserva.prototype, "cliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombre_cliente', length: 150 }),
    __metadata("design:type", String)
], Reserva.prototype, "nombreCliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_cliente', length: 150, nullable: true }),
    __metadata("design:type", String)
], Reserva.prototype, "emailCliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Reserva.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cantidad_personas', type: 'int' }),
    __metadata("design:type", Number)
], Reserva.prototype, "cantidadPersonas", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', {
        name: 'monto_total',
        precision: 12,
        scale: 2,
        nullable: true,
        transformer: numeric_transformer_1.numericTransformer,
    }),
    __metadata("design:type", Number)
], Reserva.prototype, "montoTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 30,
        default: EstadoReserva.PENDIENTE,
    }),
    __metadata("design:type", String)
], Reserva.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'fecha_reserva' }),
    __metadata("design:type", Date)
], Reserva.prototype, "fechaReserva", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'metodo_pago', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], Reserva.prototype, "metodoPago", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pagado_en', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Reserva.prototype, "pagadoEn", void 0);
exports.Reserva = Reserva = __decorate([
    (0, typeorm_1.Entity)('reservas')
], Reserva);
//# sourceMappingURL=reserva.entity.js.map