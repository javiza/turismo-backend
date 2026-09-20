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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const users_service_1 = require("../users/users.service");
const token_hash_1 = require("../common/utils/token-hash");
let AuthService = class AuthService {
    usersService;
    jwtService;
    config;
    constructor(usersService, jwtService, config) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.config = config;
    }
    async login(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        const passwordMatch = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        if (!user.activo) {
            throw new common_1.UnauthorizedException('Usuario deshabilitado');
        }
        const tokens = this.getTokens(user);
        await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);
        return tokens;
    }
    async refresh(dto) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(dto.refreshToken, { secret: this.config.getOrThrow('JWT_REFRESH_SECRET') });
        }
        catch {
            throw new common_1.UnauthorizedException('Refresh token inválido o vencido');
        }
        const user = await this.usersService.findByEmail(payload.email);
        if (!user || !user.activo || !user.hashedRefreshToken) {
            throw new common_1.UnauthorizedException('Sesión no válida');
        }
        const coincide = (0, token_hash_1.tokenMatches)(dto.refreshToken, user.hashedRefreshToken);
        if (!coincide) {
            throw new common_1.UnauthorizedException('Sesión no válida');
        }
        const tokens = this.getTokens(user);
        await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);
        return tokens;
    }
    async logout(userId) {
        await this.usersService.clearRefreshToken(userId);
    }
    async profile(userId) {
        return this.usersService.findOne(userId);
    }
    async cambiarPassword(userId, passwordActual, passwordNueva) {
        await this.usersService.cambiarPassword(userId, passwordActual, passwordNueva);
        return { message: 'Contraseña actualizada correctamente' };
    }
    getTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            rol: user.rol,
        };
        return {
            access_token: this.jwtService.sign(payload, {
                secret: this.config.getOrThrow('JWT_SECRET'),
                expiresIn: this.config.getOrThrow('JWT_ACCESS_EXPIRES'),
            }),
            refresh_token: this.jwtService.sign(payload, {
                secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
                expiresIn: this.config.getOrThrow('JWT_REFRESH_EXPIRES'),
            }),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map