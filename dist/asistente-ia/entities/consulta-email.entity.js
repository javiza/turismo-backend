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
exports.ConsultaEmail = exports.EstadoConsultaEmail = void 0;
const typeorm_1 = require("typeorm");
var EstadoConsultaEmail;
(function (EstadoConsultaEmail) {
    EstadoConsultaEmail["RESPONDIDA_IA"] = "RESPONDIDA_IA";
    EstadoConsultaEmail["ESCALADA"] = "ESCALADA";
    EstadoConsultaEmail["ERROR"] = "ERROR";
})(EstadoConsultaEmail || (exports.EstadoConsultaEmail = EstadoConsultaEmail = {}));
let ConsultaEmail = class ConsultaEmail {
    id;
    gmailMessageId;
    gmailThreadId;
    remitente;
    asunto;
    cuerpoOriginal;
    respuesta;
    estado;
    detalle;
    createdAt;
};
exports.ConsultaEmail = ConsultaEmail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ConsultaEmail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gmail_message_id', unique: true, length: 100 }),
    __metadata("design:type", String)
], ConsultaEmail.prototype, "gmailMessageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gmail_thread_id', length: 100 }),
    __metadata("design:type", String)
], ConsultaEmail.prototype, "gmailThreadId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], ConsultaEmail.prototype, "remitente", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 250, nullable: true }),
    __metadata("design:type", String)
], ConsultaEmail.prototype, "asunto", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'cuerpo_original' }),
    __metadata("design:type", String)
], ConsultaEmail.prototype, "cuerpoOriginal", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], ConsultaEmail.prototype, "respuesta", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoConsultaEmail,
    }),
    __metadata("design:type", String)
], ConsultaEmail.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], ConsultaEmail.prototype, "detalle", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ConsultaEmail.prototype, "createdAt", void 0);
exports.ConsultaEmail = ConsultaEmail = __decorate([
    (0, typeorm_1.Entity)('consultas_email')
], ConsultaEmail);
//# sourceMappingURL=consulta-email.entity.js.map