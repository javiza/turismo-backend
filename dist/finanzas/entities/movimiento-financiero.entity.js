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
exports.MovimientoFinanciero = exports.MetodoPago = exports.CategoriaGasto = exports.TipoMovimientoFinanciero = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const cliente_entity_1 = require("../../clientes/entities/cliente.entity");
const numeric_transformer_1 = require("../../common/transformers/numeric.transformer");
var TipoMovimientoFinanciero;
(function (TipoMovimientoFinanciero) {
    TipoMovimientoFinanciero["INGRESO_MANUAL"] = "INGRESO_MANUAL";
    TipoMovimientoFinanciero["EGRESO_MANUAL"] = "EGRESO_MANUAL";
    TipoMovimientoFinanciero["ROBO"] = "ROBO";
    TipoMovimientoFinanciero["ESTAFA"] = "ESTAFA";
    TipoMovimientoFinanciero["PERDIDA"] = "PERDIDA";
    TipoMovimientoFinanciero["AJUSTE"] = "AJUSTE";
})(TipoMovimientoFinanciero || (exports.TipoMovimientoFinanciero = TipoMovimientoFinanciero = {}));
var CategoriaGasto;
(function (CategoriaGasto) {
    CategoriaGasto["OPERACIONAL"] = "OPERACIONAL";
    CategoriaGasto["SUELDOS"] = "SUELDOS";
    CategoriaGasto["MARKETING"] = "MARKETING";
    CategoriaGasto["PROVEEDORES"] = "PROVEEDORES";
    CategoriaGasto["MANTENIMIENTO"] = "MANTENIMIENTO";
    CategoriaGasto["IMPUESTOS"] = "IMPUESTOS";
    CategoriaGasto["OTRO"] = "OTRO";
})(CategoriaGasto || (exports.CategoriaGasto = CategoriaGasto = {}));
var MetodoPago;
(function (MetodoPago) {
    MetodoPago["EFECTIVO"] = "EFECTIVO";
    MetodoPago["TRANSFERENCIA"] = "TRANSFERENCIA";
    MetodoPago["TARJETA"] = "TARJETA";
    MetodoPago["WEBPAY"] = "WEBPAY";
    MetodoPago["OTRO"] = "OTRO";
})(MetodoPago || (exports.MetodoPago = MetodoPago = {}));
let MovimientoFinanciero = class MovimientoFinanciero {
    id;
    tipo;
    monto;
    descripcion;
    categoria;
    usuarioId;
    usuario;
    clienteId;
    cliente;
    pagadorNombre;
    metodoPago;
    createdAt;
};
exports.MovimientoFinanciero = MovimientoFinanciero;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MovimientoFinanciero.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], MovimientoFinanciero.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', {
        precision: 12,
        scale: 2,
        transformer: numeric_transformer_1.numericTransformer,
    }),
    __metadata("design:type", Number)
], MovimientoFinanciero.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], MovimientoFinanciero.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], MovimientoFinanciero.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usuario_id', nullable: true }),
    __metadata("design:type", Number)
], MovimientoFinanciero.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id' }),
    __metadata("design:type", user_entity_1.User)
], MovimientoFinanciero.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cliente_id', nullable: true }),
    __metadata("design:type", Object)
], MovimientoFinanciero.prototype, "clienteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cliente_entity_1.Cliente, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'cliente_id' }),
    __metadata("design:type", Object)
], MovimientoFinanciero.prototype, "cliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pagador_nombre', type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", Object)
], MovimientoFinanciero.prototype, "pagadorNombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'metodo_pago', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], MovimientoFinanciero.prototype, "metodoPago", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], MovimientoFinanciero.prototype, "createdAt", void 0);
exports.MovimientoFinanciero = MovimientoFinanciero = __decorate([
    (0, typeorm_1.Entity)('movimientos_financieros')
], MovimientoFinanciero);
//# sourceMappingURL=movimiento-financiero.entity.js.map