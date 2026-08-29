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
exports.FinanzasController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const finanzas_service_1 = require("./finanzas.service");
const create_movimiento_financiero_dto_1 = require("./dto/create-movimiento-financiero.dto");
const update_configuracion_financiera_dto_1 = require("./dto/update-configuracion-financiera.dto");
const movimiento_financiero_entity_1 = require("./entities/movimiento-financiero.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_enum_1 = require("../common/constants/roles.enum");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let FinanzasController = class FinanzasController {
    finanzasService;
    constructor(finanzasService) {
        this.finanzasService = finanzasService;
    }
    resumen() {
        return this.finanzasService.resumen();
    }
    obtenerConfiguracion() {
        return this.finanzasService.obtenerConfiguracion();
    }
    actualizarConfiguracion(dto) {
        return this.finanzasService.actualizarConfiguracion(dto);
    }
    ingresosMensuales() {
        return this.finanzasService.ingresosMensuales();
    }
    topPaquetes() {
        return this.finanzasService.topPaquetes();
    }
    topDestinos() {
        return this.finanzasService.topDestinos();
    }
    listarMovimientos(tipo) {
        return this.finanzasService.listarMovimientos(tipo);
    }
    gastosPorCategoria() {
        return this.finanzasService.gastosPorCategoria();
    }
    registrarMovimiento(dto, user) {
        return this.finanzasService.registrarMovimiento(dto, user.sub);
    }
    eliminarMovimiento(id, user) {
        return this.finanzasService.eliminarMovimiento(id, user.rol);
    }
};
exports.FinanzasController = FinanzasController;
__decorate([
    (0, common_1.Get)('resumen'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanzasController.prototype, "resumen", null);
__decorate([
    (0, common_1.Get)('configuracion'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanzasController.prototype, "obtenerConfiguracion", null);
__decorate([
    (0, common_1.Patch)('configuracion'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_configuracion_financiera_dto_1.UpdateConfiguracionFinancieraDto]),
    __metadata("design:returntype", void 0)
], FinanzasController.prototype, "actualizarConfiguracion", null);
__decorate([
    (0, common_1.Get)('ingresos-mensuales'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanzasController.prototype, "ingresosMensuales", null);
__decorate([
    (0, common_1.Get)('top-paquetes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanzasController.prototype, "topPaquetes", null);
__decorate([
    (0, common_1.Get)('top-destinos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanzasController.prototype, "topDestinos", null);
__decorate([
    (0, common_1.Get)('movimientos'),
    __param(0, (0, common_1.Query)('tipo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanzasController.prototype, "listarMovimientos", null);
__decorate([
    (0, common_1.Get)('gastos-por-categoria'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanzasController.prototype, "gastosPorCategoria", null);
__decorate([
    (0, common_1.Post)('movimientos'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_movimiento_financiero_dto_1.CreateMovimientoFinancieroDto, Object]),
    __metadata("design:returntype", void 0)
], FinanzasController.prototype, "registrarMovimiento", null);
__decorate([
    (0, common_1.Delete)('movimientos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], FinanzasController.prototype, "eliminarMovimiento", null);
exports.FinanzasController = FinanzasController = __decorate([
    (0, common_1.Controller)('finanzas'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN, roles_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [finanzas_service_1.FinanzasService])
], FinanzasController);
//# sourceMappingURL=finanzas.controller.js.map