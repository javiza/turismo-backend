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
exports.ActualizarMercadoPagoDto = exports.ActualizarTransbankDto = exports.ActualizarWhatsappDto = exports.ActualizarSmtpDto = void 0;
const class_validator_1 = require("class-validator");
class ActualizarSmtpDto {
    host;
    port;
    user;
    password;
    from;
    adminEmail;
}
exports.ActualizarSmtpDto = ActualizarSmtpDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], ActualizarSmtpDto.prototype, "host", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ActualizarSmtpDto.prototype, "port", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], ActualizarSmtpDto.prototype, "user", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActualizarSmtpDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], ActualizarSmtpDto.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], ActualizarSmtpDto.prototype, "adminEmail", void 0);
class ActualizarWhatsappDto {
    token;
    phoneNumberId;
    adminNumber;
    apiVersion;
}
exports.ActualizarWhatsappDto = ActualizarWhatsappDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActualizarWhatsappDto.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], ActualizarWhatsappDto.prototype, "phoneNumberId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], ActualizarWhatsappDto.prototype, "adminNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActualizarWhatsappDto.prototype, "apiVersion", void 0);
class ActualizarTransbankDto {
    commerceCode;
    apiKey;
    environment;
}
exports.ActualizarTransbankDto = ActualizarTransbankDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], ActualizarTransbankDto.prototype, "commerceCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActualizarTransbankDto.prototype, "apiKey", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['integration', 'production']),
    __metadata("design:type", String)
], ActualizarTransbankDto.prototype, "environment", void 0);
class ActualizarMercadoPagoDto {
    accessToken;
    publicKey;
}
exports.ActualizarMercadoPagoDto = ActualizarMercadoPagoDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActualizarMercadoPagoDto.prototype, "accessToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], ActualizarMercadoPagoDto.prototype, "publicKey", void 0);
//# sourceMappingURL=configuracion.dto.js.map