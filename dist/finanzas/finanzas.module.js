"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanzasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const finanzas_service_1 = require("./finanzas.service");
const finanzas_controller_1 = require("./finanzas.controller");
const reserva_entity_1 = require("../reservas/entities/reserva.entity");
const movimiento_financiero_entity_1 = require("./entities/movimiento-financiero.entity");
const configuracion_financiera_entity_1 = require("./entities/configuracion-financiera.entity");
let FinanzasModule = class FinanzasModule {
};
exports.FinanzasModule = FinanzasModule;
exports.FinanzasModule = FinanzasModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                reserva_entity_1.Reserva,
                movimiento_financiero_entity_1.MovimientoFinanciero,
                configuracion_financiera_entity_1.ConfiguracionFinanciera,
            ]),
        ],
        controllers: [finanzas_controller_1.FinanzasController],
        providers: [finanzas_service_1.FinanzasService],
    })
], FinanzasModule);
//# sourceMappingURL=finanzas.module.js.map