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
exports.JwtClienteStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const clientes_service_1 = require("../../clientes/clientes.service");
let JwtClienteStrategy = class JwtClienteStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-cliente') {
    clientesService;
    constructor(configService, clientesService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow('JWT_CLIENTE_SECRET'),
        });
        this.clientesService = clientesService;
    }
    async validate(payload) {
        const cliente = await this.clientesService
            .findOne(payload.sub)
            .catch(() => null);
        if (!cliente || !cliente.activo) {
            throw new common_1.UnauthorizedException('Cuenta no válida o deshabilitada');
        }
        return {
            sub: cliente.id,
            email: cliente.email,
            nombre: cliente.nombre,
            tipo: 'cliente',
        };
    }
};
exports.JwtClienteStrategy = JwtClienteStrategy;
exports.JwtClienteStrategy = JwtClienteStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        clientes_service_1.ClientesService])
], JwtClienteStrategy);
//# sourceMappingURL=jwt-cliente.strategy.js.map