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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const bcrypt_rounds_1 = require("../common/utils/bcrypt-rounds");
const token_hash_1 = require("../common/utils/token-hash");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(dto) {
        const exists = await this.userRepository.findOne({
            where: {
                email: dto.email,
            },
        });
        if (exists) {
            throw new common_1.ConflictException('Email ya registrado');
        }
        const hashedPassword = await bcrypt.hash(dto.password, (0, bcrypt_rounds_1.getBcryptRounds)());
        const user = this.userRepository.create({
            ...dto,
            password: hashedPassword,
        });
        return await this.userRepository.save(user);
    }
    async findAll(q) {
        if (!q) {
            return await this.userRepository.find();
        }
        const termino = `%${q.trim()}%`;
        return this.userRepository
            .createQueryBuilder('usuario')
            .where('usuario.nombre ILIKE :termino', { termino })
            .orWhere('usuario.email ILIKE :termino', { termino })
            .orWhere('usuario.rut ILIKE :termino', { termino })
            .getMany();
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        return user;
    }
    async findByEmail(email) {
        return await this.userRepository.findOne({
            where: { email },
        });
    }
    async deactivate(id) {
        const user = await this.findOne(id);
        user.activo = false;
        return this.userRepository.save(user);
    }
    async reactivate(id) {
        const user = await this.findOne(id);
        user.activo = true;
        return this.userRepository.save(user);
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashed = (0, token_hash_1.hashToken)(refreshToken);
        await this.userRepository.update(userId, {
            hashedRefreshToken: hashed,
        });
    }
    async clearRefreshToken(userId) {
        await this.userRepository.update(userId, {
            hashedRefreshToken: null,
        });
    }
    async cambiarPassword(userId, passwordActual, passwordNueva) {
        const user = await this.findOne(userId);
        const coincide = await bcrypt.compare(passwordActual, user.password);
        if (!coincide) {
            throw new common_1.UnauthorizedException('La contraseña actual no es correcta');
        }
        user.password = await bcrypt.hash(passwordNueva, (0, bcrypt_rounds_1.getBcryptRounds)());
        await this.userRepository.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map