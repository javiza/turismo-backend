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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfiguracionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const configuracion_service_1 = require("./configuracion.service");
const configuracion_integracion_entity_1 = require("./entities/configuracion-integracion.entity");
const configuracion_dto_1 = require("./dto/configuracion.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_enum_1 = require("../common/constants/roles.enum");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
function enmascarar(valor) {
    if (!valor)
        return '';
    if (valor.length <= 4)
        return '••••';
    return `••••${valor.slice(-4)}`;
}
let ConfiguracionController = class ConfiguracionController {
    service;
    constructor(service) {
        this.service = service;
    }
    async obtenerSmtp() {
        const cfg = await this.service.obtenerSmtp();
        const estado = await this.service.obtenerEstado(configuracion_integracion_entity_1.ClaveIntegracion.SMTP);
        return {
            ...cfg,
            password: enmascarar(cfg.password),
            configurado: Boolean(cfg.host && cfg.user && cfg.password),
            ...estado,
        };
    }
    async actualizarSmtp(dto, user) {
        const actual = await this.service.obtenerSmtp();
        await this.service.guardar(configuracion_integracion_entity_1.ClaveIntegracion.SMTP, {
            host: dto.host,
            port: dto.port,
            user: dto.user,
            password: dto.password || actual.password,
            from: dto.from,
            adminEmail: dto.adminEmail,
        }, user.sub);
        return { message: 'Configuración SMTP actualizada' };
    }
    async obtenerWhatsapp() {
        const cfg = await this.service.obtenerWhatsapp();
        const estado = await this.service.obtenerEstado(configuracion_integracion_entity_1.ClaveIntegracion.WHATSAPP);
        return {
            ...cfg,
            token: enmascarar(cfg.token),
            configurado: Boolean(cfg.token && cfg.phoneNumberId && cfg.adminNumber),
            ...estado,
        };
    }
    async actualizarWhatsapp(dto, user) {
        const actual = await this.service.obtenerWhatsapp();
        await this.service.guardar(configuracion_integracion_entity_1.ClaveIntegracion.WHATSAPP, {
            token: dto.token || actual.token,
            phoneNumberId: dto.phoneNumberId,
            adminNumber: dto.adminNumber,
            apiVersion: dto.apiVersion || actual.apiVersion,
        }, user.sub);
        return { message: 'Configuración de WhatsApp actualizada' };
    }
    async obtenerTransbank() {
        const cfg = await this.service.obtenerTransbank();
        const estado = await this.service.obtenerEstado(configuracion_integracion_entity_1.ClaveIntegracion.TRANSBANK);
        return {
            ...cfg,
            apiKey: enmascarar(cfg.apiKey),
            configurado: Boolean(cfg.commerceCode && cfg.apiKey),
            ...estado,
        };
    }
    async actualizarTransbank(dto, user) {
        const actual = await this.service.obtenerTransbank();
        await this.service.guardar(configuracion_integracion_entity_1.ClaveIntegracion.TRANSBANK, {
            commerceCode: dto.commerceCode,
            apiKey: dto.apiKey || actual.apiKey,
            environment: dto.environment,
        }, user.sub);
        return { message: 'Configuración de Transbank actualizada' };
    }
    async obtenerMercadoPago() {
        const cfg = await this.service.obtenerMercadoPago();
        const estado = await this.service.obtenerEstado(configuracion_integracion_entity_1.ClaveIntegracion.MERCADOPAGO);
        return {
            ...cfg,
            accessToken: enmascarar(cfg.accessToken),
            configurado: Boolean(cfg.accessToken && cfg.publicKey),
            ...estado,
        };
    }
    async actualizarMercadoPago(dto, user) {
        const actual = await this.service.obtenerMercadoPago();
        await this.service.guardar(configuracion_integracion_entity_1.ClaveIntegracion.MERCADOPAGO, {
            accessToken: dto.accessToken || actual.accessToken,
            publicKey: dto.publicKey,
        }, user.sub);
        return { message: 'Configuración de Mercado Pago actualizada' };
    }
};
exports.ConfiguracionController = ConfiguracionController;
__decorate([
    (0, common_1.Get)('smtp'),
    (0, swagger_1.ApiOperation)({ summary: 'Estado actual de la config SMTP (contraseña enmascarada)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfiguracionController.prototype, "obtenerSmtp", null);
__decorate([
    (0, common_1.Patch)('smtp'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualiza las credenciales SMTP' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [configuracion_dto_1.ActualizarSmtpDto, Object]),
    __metadata("design:returntype", Promise)
], ConfiguracionController.prototype, "actualizarSmtp", null);
__decorate([
    (0, common_1.Get)('whatsapp'),
    (0, swagger_1.ApiOperation)({ summary: 'Estado actual de la config de WhatsApp (token enmascarado)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfiguracionController.prototype, "obtenerWhatsapp", null);
__decorate([
    (0, common_1.Patch)('whatsapp'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualiza las credenciales de WhatsApp Business Cloud API' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [configuracion_dto_1.ActualizarWhatsappDto, Object]),
    __metadata("design:returntype", Promise)
], ConfiguracionController.prototype, "actualizarWhatsapp", null);
__decorate([
    (0, common_1.Get)('transbank'),
    (0, swagger_1.ApiOperation)({ summary: 'Estado actual de la config de Transbank (API key enmascarada)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfiguracionController.prototype, "obtenerTransbank", null);
__decorate([
    (0, common_1.Patch)('transbank'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualiza las credenciales de Transbank Webpay Plus' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [configuracion_dto_1.ActualizarTransbankDto, Object]),
    __metadata("design:returntype", Promise)
], ConfiguracionController.prototype, "actualizarTransbank", null);
__decorate([
    (0, common_1.Get)('mercadopago'),
    (0, swagger_1.ApiOperation)({ summary: 'Estado actual de la config de Mercado Pago (access token enmascarado)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfiguracionController.prototype, "obtenerMercadoPago", null);
__decorate([
    (0, common_1.Patch)('mercadopago'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualiza las credenciales de Mercado Pago' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [configuracion_dto_1.ActualizarMercadoPagoDto, Object]),
    __metadata("design:returntype", Promise)
], ConfiguracionController.prototype, "actualizarMercadoPago", null);
exports.ConfiguracionController = ConfiguracionController = __decorate([
    (0, swagger_1.ApiTags)('Configuración (credenciales de integraciones)'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('configuracion'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN, roles_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [configuracion_service_1.ConfiguracionService])
], ConfiguracionController);
//# sourceMappingURL=configuracion.controller.js.map