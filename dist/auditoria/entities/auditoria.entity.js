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
exports.Auditoria = exports.AccionAuditoria = void 0;
const typeorm_1 = require("typeorm");
var AccionAuditoria;
(function (AccionAuditoria) {
    AccionAuditoria["INSERT"] = "INSERT";
    AccionAuditoria["UPDATE"] = "UPDATE";
    AccionAuditoria["DELETE"] = "DELETE";
})(AccionAuditoria || (exports.AccionAuditoria = AccionAuditoria = {}));
let Auditoria = class Auditoria {
    id;
    tabla;
    accion;
    registroId;
    usuarioId;
    datosAnteriores;
    datosNuevos;
    createdAt;
};
exports.Auditoria = Auditoria;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Auditoria.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Auditoria.prototype, "tabla", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Auditoria.prototype, "accion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'registro_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], Auditoria.prototype, "registroId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usuario_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], Auditoria.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { name: 'datos_anteriores', nullable: true }),
    __metadata("design:type", Object)
], Auditoria.prototype, "datosAnteriores", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { name: 'datos_nuevos', nullable: true }),
    __metadata("design:type", Object)
], Auditoria.prototype, "datosNuevos", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Auditoria.prototype, "createdAt", void 0);
exports.Auditoria = Auditoria = __decorate([
    (0, typeorm_1.Entity)('auditoria')
], Auditoria);
//# sourceMappingURL=auditoria.entity.js.map