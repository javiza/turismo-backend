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
exports.PagoWebpay = exports.EstadoPagoWebpay = void 0;
const typeorm_1 = require("typeorm");
const reserva_entity_1 = require("../../reservas/entities/reserva.entity");
const numeric_transformer_1 = require("../../common/transformers/numeric.transformer");
var EstadoPagoWebpay;
(function (EstadoPagoWebpay) {
    EstadoPagoWebpay["INICIADO"] = "INICIADO";
    EstadoPagoWebpay["AUTORIZADO"] = "AUTORIZADO";
    EstadoPagoWebpay["RECHAZADO"] = "RECHAZADO";
    EstadoPagoWebpay["ANULADO"] = "ANULADO";
})(EstadoPagoWebpay || (exports.EstadoPagoWebpay = EstadoPagoWebpay = {}));
let PagoWebpay = class PagoWebpay {
    id;
    reservaId;
    reserva;
    buyOrder;
    sessionId;
    token;
    monto;
    estado;
    codigoAutorizacion;
    codigoRespuesta;
    tipoPago;
    cuotas;
    ultimosDigitosTarjeta;
    fechaTransaccion;
    respuestaCruda;
    createdAt;
};
exports.PagoWebpay = PagoWebpay;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PagoWebpay.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reserva_id' }),
    __metadata("design:type", Number)
], PagoWebpay.prototype, "reservaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => reserva_entity_1.Reserva, { onDelete: 'CASCADE', nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'reserva_id' }),
    __metadata("design:type", reserva_entity_1.Reserva)
], PagoWebpay.prototype, "reserva", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'buy_order', length: 26, unique: true }),
    __metadata("design:type", String)
], PagoWebpay.prototype, "buyOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id', length: 61 }),
    __metadata("design:type", String)
], PagoWebpay.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64, nullable: true }),
    __metadata("design:type", Object)
], PagoWebpay.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', {
        precision: 12,
        scale: 2,
        transformer: numeric_transformer_1.numericTransformer,
    }),
    __metadata("design:type", Number)
], PagoWebpay.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: EstadoPagoWebpay.INICIADO,
    }),
    __metadata("design:type", String)
], PagoWebpay.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'codigo_autorizacion', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], PagoWebpay.prototype, "codigoAutorizacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'codigo_respuesta', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], PagoWebpay.prototype, "codigoRespuesta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_pago', type: 'varchar', length: 5, nullable: true }),
    __metadata("design:type", Object)
], PagoWebpay.prototype, "tipoPago", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cuotas', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], PagoWebpay.prototype, "cuotas", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ultimos_digitos_tarjeta', type: 'varchar', length: 4, nullable: true }),
    __metadata("design:type", Object)
], PagoWebpay.prototype, "ultimosDigitosTarjeta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_transaccion', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], PagoWebpay.prototype, "fechaTransaccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'respuesta_cruda', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], PagoWebpay.prototype, "respuestaCruda", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PagoWebpay.prototype, "createdAt", void 0);
exports.PagoWebpay = PagoWebpay = __decorate([
    (0, typeorm_1.Entity)('pagos_webpay')
], PagoWebpay);
//# sourceMappingURL=pago-webpay.entity.js.map