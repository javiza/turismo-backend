"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientesAuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const clientes_auth_controller_1 = require("./clientes-auth.controller");
const clientes_auth_service_1 = require("./clientes-auth.service");
const jwt_cliente_strategy_1 = require("./strategies/jwt-cliente.strategy");
const clientes_module_1 = require("../clientes/clientes.module");
const reservas_module_1 = require("../reservas/reservas.module");
const cotizaciones_module_1 = require("../cotizaciones/cotizaciones.module");
const email_module_1 = require("../email/email.module");
let ClientesAuthModule = class ClientesAuthModule {
};
exports.ClientesAuthModule = ClientesAuthModule;
exports.ClientesAuthModule = ClientesAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            clientes_module_1.ClientesModule,
            reservas_module_1.ReservasModule,
            cotizaciones_module_1.CotizacionesModule,
            email_module_1.EmailModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_CLIENTE_SECRET'),
                    signOptions: { expiresIn: '1d' },
                }),
            }),
        ],
        controllers: [clientes_auth_controller_1.ClientesAuthController],
        providers: [clientes_auth_service_1.ClientesAuthService, jwt_cliente_strategy_1.JwtClienteStrategy],
        exports: [clientes_auth_service_1.ClientesAuthService],
    })
], ClientesAuthModule);
//# sourceMappingURL=clientes-auth.module.js.map