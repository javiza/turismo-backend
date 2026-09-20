"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientesAuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const clientes_service_1 = require("../clientes/clientes.service");
const reservas_service_1 = require("../reservas/reservas.service");
const cotizaciones_service_1 = require("../cotizaciones/cotizaciones.service");
const token_hash_1 = require("../common/utils/token-hash");
const email_service_1 = require("../email/email.service");
let ClientesAuthService = class ClientesAuthService {
    clientesService;
    jwtService;
    config;
    reservasService;
    cotizacionesService;
    emailService;
    constructor(clientesService, jwtService, config, reservasService, cotizacionesService, emailService) {
        this.clientesService = clientesService;
        this.jwtService = jwtService;
        this.config = config;
        this.reservasService = reservasService;
        this.cotizacionesService = cotizacionesService;
        this.emailService = emailService;
    }
    async registro(dto) {
        const cliente = await this.clientesService.registrar(dto);
        const tokens = this.getTokens(cliente);
        await this.clientesService.updateRefreshToken(cliente.id, tokens.refresh_token);
        return tokens;
    }
    async login(dto) {
        const cliente = await this.clientesService.findByEmail(dto.email);
        if (!cliente)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        const passwordMatch = await bcrypt.compare(dto.password, cliente.password);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        if (!cliente.activo) {
            throw new common_1.UnauthorizedException('Cuenta deshabilitada');
        }
        const tokens = this.getTokens(cliente);
        await this.clientesService.updateRefreshToken(cliente.id, tokens.refresh_token);
        return tokens;
    }
    async refresh(dto) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(dto.refreshToken, {
                secret: this.config.getOrThrow('JWT_CLIENTE_REFRESH_SECRET'),
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Refresh token inválido o vencido');
        }
        const cliente = await this.clientesService.findByEmail(payload.email);
        if (!cliente || !cliente.activo || !cliente.hashedRefreshToken) {
            throw new common_1.UnauthorizedException('Sesión no válida');
        }
        const coincide = (0, token_hash_1.tokenMatches)(dto.refreshToken, cliente.hashedRefreshToken);
        if (!coincide) {
            throw new common_1.UnauthorizedException('Sesión no válida');
        }
        const tokens = this.getTokens(cliente);
        await this.clientesService.updateRefreshToken(cliente.id, tokens.refresh_token);
        return tokens;
    }
    async logout(clienteId) {
        await this.clientesService.clearRefreshToken(clienteId);
    }
    async perfil(clienteId) {
        return this.clientesService.findOne(clienteId);
    }
    async actualizarPerfil(clienteId, dto) {
        return this.clientesService.actualizar(clienteId, dto);
    }
    async cambiarPassword(clienteId, passwordActual, passwordNueva) {
        await this.clientesService.cambiarPassword(clienteId, passwordActual, passwordNueva);
        return { message: 'Contraseña actualizada correctamente' };
    }
    async forgotPassword(email) {
        const resultado = await this.clientesService.generarTokenReseteo(email);
        if (resultado) {
            const frontendUrl = this.config.get('FRONTEND_URL') ?? 'http://localhost:3001';
            const resetUrl = `${frontendUrl}/restablecer-password?token=${resultado.token}`;
            await this.emailService.enviarRecuperacionPassword({
                email: resultado.cliente.email,
                nombre: resultado.cliente.nombre,
                resetUrl,
            });
        }
        return {
            message: 'Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña.',
        };
    }
    async resetPassword(token, passwordNueva) {
        await this.clientesService.resetearPasswordConToken(token, passwordNueva);
        return {
            message: 'Contraseña restablecida correctamente. Ya puedes iniciar sesión.',
        };
    }
    async misReservas(clienteId) {
        return this.reservasService.findByCliente(clienteId);
    }
    async cancelarReserva(reservaId, clienteId) {
        return this.reservasService.cancelarPropia(reservaId, clienteId);
    }
    async misCotizaciones(clienteId) {
        return this.cotizacionesService.findByCliente(clienteId);
    }
    getTokens(cliente) {
        const payload = {
            sub: cliente.id,
            email: cliente.email,
            nombre: cliente.nombre,
            tipo: 'cliente',
        };
        return {
            access_token: this.jwtService.sign(payload, {
                secret: this.config.getOrThrow('JWT_CLIENTE_SECRET'),
                expiresIn: this.config.getOrThrow('JWT_CLIENTE_ACCESS_EXPIRES'),
            }),
            refresh_token: this.jwtService.sign(payload, {
                secret: this.config.getOrThrow('JWT_CLIENTE_REFRESH_SECRET'),
                expiresIn: this.config.getOrThrow('JWT_CLIENTE_REFRESH_EXPIRES'),
            }),
        };
    }
};
exports.ClientesAuthService = ClientesAuthService;
exports.ClientesAuthService = ClientesAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clientes_service_1.ClientesService,
        jwt_1.JwtService,
        config_1.ConfigService,
        reservas_service_1.ReservasService,
        cotizaciones_service_1.CotizacionesService,
        email_service_1.EmailService])
], ClientesAuthService);
//# sourceMappingURL=clientes-auth.service.js.map