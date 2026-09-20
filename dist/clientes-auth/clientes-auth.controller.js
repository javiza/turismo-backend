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
exports.ClientesAuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const clientes_auth_service_1 = require("./clientes-auth.service");
const registro_cliente_dto_1 = require("./dto/registro-cliente.dto");
const update_perfil_cliente_dto_1 = require("./dto/update-perfil-cliente.dto");
const login_cliente_dto_1 = require("./dto/login-cliente.dto");
const refresh_token_cliente_dto_1 = require("./dto/refresh-token-cliente.dto");
const cambiar_password_dto_1 = require("../common/dto/cambiar-password.dto");
const forgot_password_cliente_dto_1 = require("./dto/forgot-password-cliente.dto");
const reset_password_cliente_dto_1 = require("./dto/reset-password-cliente.dto");
const jwt_cliente_auth_guard_1 = require("./guards/jwt-cliente-auth.guard");
const current_cliente_decorator_1 = require("../common/decorators/current-cliente.decorator");
let ClientesAuthController = class ClientesAuthController {
    clientesAuthService;
    constructor(clientesAuthService) {
        this.clientesAuthService = clientesAuthService;
    }
    registro(dto) {
        return this.clientesAuthService.registro(dto);
    }
    login(dto) {
        return this.clientesAuthService.login(dto);
    }
    refresh(dto) {
        return this.clientesAuthService.refresh(dto);
    }
    async logout(cliente) {
        await this.clientesAuthService.logout(cliente.sub);
        return { message: 'Sesión cerrada correctamente' };
    }
    forgotPassword(dto) {
        return this.clientesAuthService.forgotPassword(dto.email);
    }
    resetPassword(dto) {
        return this.clientesAuthService.resetPassword(dto.token, dto.passwordNueva);
    }
    perfil(cliente) {
        return this.clientesAuthService.perfil(cliente.sub);
    }
    actualizarPerfil(dto, cliente) {
        return this.clientesAuthService.actualizarPerfil(cliente.sub, dto);
    }
    cambiarPassword(dto, cliente) {
        return this.clientesAuthService.cambiarPassword(cliente.sub, dto.passwordActual, dto.passwordNueva);
    }
    misReservas(cliente) {
        return this.clientesAuthService.misReservas(cliente.sub);
    }
    misCotizaciones(cliente) {
        return this.clientesAuthService.misCotizaciones(cliente.sub);
    }
    cancelarReserva(id, cliente) {
        return this.clientesAuthService.cancelarReserva(+id, cliente.sub);
    }
};
exports.ClientesAuthController = ClientesAuthController;
__decorate([
    (0, common_1.Post)('registro'),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60_000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Crea una cuenta de cliente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [registro_cliente_dto_1.RegistroClienteDto]),
    __metadata("design:returntype", void 0)
], ClientesAuthController.prototype, "registro", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60_000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Login de cliente' }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Credenciales inválidas o cuenta deshabilitada',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_cliente_dto_1.LoginClienteDto]),
    __metadata("design:returntype", void 0)
], ClientesAuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60_000 } }),
    (0, swagger_1.ApiOperation)({
        summary: 'Renueva access_token y refresh_token del cliente (con rotación)',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_cliente_dto_1.RefreshTokenClienteDto]),
    __metadata("design:returntype", void 0)
], ClientesAuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiBearerAuth)('JWT-cliente'),
    (0, common_1.UseGuards)(jwt_cliente_auth_guard_1.JwtClienteAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Invalida la sesión actual del cliente' }),
    __param(0, (0, current_cliente_decorator_1.CurrentCliente)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientesAuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60_000 } }),
    (0, swagger_1.ApiOperation)({
        summary: 'Solicita un enlace de recuperación de contraseña por email',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_cliente_dto_1.ForgotPasswordClienteDto]),
    __metadata("design:returntype", void 0)
], ClientesAuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60_000 } }),
    (0, swagger_1.ApiOperation)({
        summary: 'Restablece la contraseña usando el token recibido por email',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'El enlace de recuperación no es válido o venció',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_cliente_dto_1.ResetPasswordClienteDto]),
    __metadata("design:returntype", void 0)
], ClientesAuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('perfil'),
    (0, swagger_1.ApiBearerAuth)('JWT-cliente'),
    (0, common_1.UseGuards)(jwt_cliente_auth_guard_1.JwtClienteAuthGuard),
    __param(0, (0, current_cliente_decorator_1.CurrentCliente)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientesAuthController.prototype, "perfil", null);
__decorate([
    (0, common_1.Patch)('perfil'),
    (0, swagger_1.ApiBearerAuth)('JWT-cliente'),
    (0, common_1.UseGuards)(jwt_cliente_auth_guard_1.JwtClienteAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Edita nombre/email/teléfono/RUT del cliente autenticado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Ya existe una cuenta con ese email',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_cliente_decorator_1.CurrentCliente)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_perfil_cliente_dto_1.UpdatePerfilClienteDto, Object]),
    __metadata("design:returntype", void 0)
], ClientesAuthController.prototype, "actualizarPerfil", null);
__decorate([
    (0, common_1.Patch)('password'),
    (0, swagger_1.ApiBearerAuth)('JWT-cliente'),
    (0, common_1.UseGuards)(jwt_cliente_auth_guard_1.JwtClienteAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Cambia la contraseña del cliente autenticado' }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'La contraseña actual no es correcta',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_cliente_decorator_1.CurrentCliente)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cambiar_password_dto_1.CambiarPasswordDto, Object]),
    __metadata("design:returntype", void 0)
], ClientesAuthController.prototype, "cambiarPassword", null);
__decorate([
    (0, common_1.Get)('mis-reservas'),
    (0, swagger_1.ApiBearerAuth)('JWT-cliente'),
    (0, common_1.UseGuards)(jwt_cliente_auth_guard_1.JwtClienteAuthGuard),
    __param(0, (0, current_cliente_decorator_1.CurrentCliente)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientesAuthController.prototype, "misReservas", null);
__decorate([
    (0, common_1.Get)('mis-cotizaciones'),
    (0, swagger_1.ApiBearerAuth)('JWT-cliente'),
    (0, common_1.UseGuards)(jwt_cliente_auth_guard_1.JwtClienteAuthGuard),
    __param(0, (0, current_cliente_decorator_1.CurrentCliente)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientesAuthController.prototype, "misCotizaciones", null);
__decorate([
    (0, common_1.Patch)('mis-reservas/:id/cancelar'),
    (0, swagger_1.ApiBearerAuth)('JWT-cliente'),
    (0, common_1.UseGuards)(jwt_cliente_auth_guard_1.JwtClienteAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Cancela una reserva propia del cliente autenticado',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_cliente_decorator_1.CurrentCliente)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ClientesAuthController.prototype, "cancelarReserva", null);
exports.ClientesAuthController = ClientesAuthController = __decorate([
    (0, swagger_1.ApiTags)('Clientes Auth'),
    (0, common_1.Controller)('clientes-auth'),
    __metadata("design:paramtypes", [clientes_auth_service_1.ClientesAuthService])
], ClientesAuthController);
//# sourceMappingURL=clientes-auth.controller.js.map