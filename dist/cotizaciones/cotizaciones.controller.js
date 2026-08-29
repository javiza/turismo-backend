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
exports.CotizacionesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cotizaciones_service_1 = require("./cotizaciones.service");
const create_cotizacion_dto_1 = require("./dto/create-cotizacion.dto");
const update_cotizacion_dto_1 = require("./dto/update-cotizacion.dto");
const admin_cotizacion_dto_1 = require("./dto/admin-cotizacion.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_enum_1 = require("../common/constants/roles.enum");
const optional_jwt_cliente_auth_guard_1 = require("../clientes-auth/guards/optional-jwt-cliente-auth.guard");
const current_cliente_decorator_1 = require("../common/decorators/current-cliente.decorator");
let CotizacionesController = class CotizacionesController {
    cotizacionesService;
    constructor(cotizacionesService) {
        this.cotizacionesService = cotizacionesService;
    }
    create(dto, cliente) {
        return this.cotizacionesService.create(dto, cliente?.sub);
    }
    findAll() {
        return this.cotizacionesService.findAll();
    }
    contarNoLeidas() {
        return this.cotizacionesService.contarNoLeidas();
    }
    findOne(id) {
        return this.cotizacionesService.findOne(+id);
    }
    updateEstado(id, dto) {
        return this.cotizacionesService.updateEstado(+id, dto);
    }
    updateAdmin(id, dto) {
        return this.cotizacionesService.updateAdmin(+id, dto);
    }
    remove(id) {
        return this.cotizacionesService.remove(+id);
    }
};
exports.CotizacionesController = CotizacionesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(optional_jwt_cliente_auth_guard_1.OptionalJwtClienteAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_cliente_decorator_1.CurrentCliente)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cotizacion_dto_1.CreateCotizacionDto, Object]),
    __metadata("design:returntype", void 0)
], CotizacionesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN, roles_enum_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CotizacionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('no-leidas/count'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN, roles_enum_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CotizacionesController.prototype, "contarNoLeidas", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN, roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CotizacionesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/estado'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN, roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_cotizacion_dto_1.UpdateCotizacionDto]),
    __metadata("design:returntype", void 0)
], CotizacionesController.prototype, "updateEstado", null);
__decorate([
    (0, common_1.Patch)(':id/admin'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN, roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_cotizacion_dto_1.AdminCotizacionDto]),
    __metadata("design:returntype", void 0)
], CotizacionesController.prototype, "updateAdmin", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN, roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CotizacionesController.prototype, "remove", null);
exports.CotizacionesController = CotizacionesController = __decorate([
    (0, common_1.Controller)('cotizaciones'),
    __metadata("design:paramtypes", [cotizaciones_service_1.CotizacionesService])
], CotizacionesController);
//# sourceMappingURL=cotizaciones.controller.js.map