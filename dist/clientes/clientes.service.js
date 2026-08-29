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
exports.ClientesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const bcrypt_rounds_1 = require("../common/utils/bcrypt-rounds");
const token_hash_1 = require("../common/utils/token-hash");
const cliente_entity_1 = require("./entities/cliente.entity");
let ClientesService = class ClientesService {
    clienteRepository;
    constructor(clienteRepository) {
        this.clienteRepository = clienteRepository;
    }
    async registrar(dto) {
        const existe = await this.clienteRepository.findOne({
            where: { email: dto.email },
        });
        if (existe) {
            throw new common_1.ConflictException('Ya existe una cuenta con ese email');
        }
        const password = await bcrypt.hash(dto.password, (0, bcrypt_rounds_1.getBcryptRounds)());
        const cliente = this.clienteRepository.create({
            nombre: dto.nombre,
            email: dto.email,
            telefono: dto.telefono,
            rut: dto.rut,
            telefonosAdicionales: dto.telefonosAdicionales ?? [],
            correosAdicionales: dto.correosAdicionales ?? [],
            password,
            activo: true,
        });
        return this.clienteRepository.save(cliente);
    }
    async findByEmail(email) {
        return this.clienteRepository.findOne({ where: { email } });
    }
    async findOne(id) {
        const cliente = await this.clienteRepository.findOne({ where: { id } });
        if (!cliente) {
            throw new common_1.NotFoundException('Cliente no encontrado');
        }
        return cliente;
    }
    async updateRefreshToken(id, refreshToken) {
        const hashed = (0, token_hash_1.hashToken)(refreshToken);
        await this.clienteRepository.update(id, { hashedRefreshToken: hashed });
    }
    async clearRefreshToken(id) {
        await this.clienteRepository.update(id, { hashedRefreshToken: null });
    }
    async findAll(q) {
        if (!q) {
            return this.clienteRepository.find({ order: { createdAt: 'DESC' } });
        }
        const termino = `%${q.trim()}%`;
        return this.clienteRepository
            .createQueryBuilder('cliente')
            .where('cliente.nombre ILIKE :termino', { termino })
            .orWhere('cliente.email ILIKE :termino', { termino })
            .orWhere('cliente.rut ILIKE :termino', { termino })
            .orderBy('cliente.createdAt', 'DESC')
            .getMany();
    }
    async deactivate(id) {
        const cliente = await this.findOne(id);
        cliente.activo = false;
        return this.clienteRepository.save(cliente);
    }
    async actualizar(id, dto) {
        const cliente = await this.findOne(id);
        const nuevoEmail = dto.email;
        if (nuevoEmail && nuevoEmail !== cliente.email) {
            const existe = await this.clienteRepository.findOne({
                where: { email: nuevoEmail },
            });
            if (existe) {
                throw new common_1.ConflictException('Ya existe una cuenta con ese email');
            }
        }
        Object.assign(cliente, dto);
        return this.clienteRepository.save(cliente);
    }
    async reactivate(id) {
        const cliente = await this.findOne(id);
        cliente.activo = true;
        return this.clienteRepository.save(cliente);
    }
    async cambiarPassword(clienteId, passwordActual, passwordNueva) {
        const cliente = await this.findOne(clienteId);
        const coincide = await bcrypt.compare(passwordActual, cliente.password);
        if (!coincide) {
            throw new common_1.UnauthorizedException('La contraseña actual no es correcta');
        }
        cliente.password = await bcrypt.hash(passwordNueva, (0, bcrypt_rounds_1.getBcryptRounds)());
        await this.clienteRepository.save(cliente);
    }
    async generarTokenReseteo(email) {
        const cliente = await this.findByEmail(email);
        if (!cliente || !cliente.activo)
            return null;
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        cliente.resetPasswordToken = (0, token_hash_1.hashToken)(token);
        cliente.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
        await this.clienteRepository.save(cliente);
        return { cliente, token };
    }
    async resetearPasswordConToken(token, passwordNueva) {
        const candidatos = await this.clienteRepository
            .createQueryBuilder('cliente')
            .where('cliente.resetPasswordToken IS NOT NULL')
            .andWhere('cliente.resetPasswordExpires > :ahora', { ahora: new Date() })
            .getMany();
        const cliente = candidatos.find((c) => (0, token_hash_1.tokenMatches)(token, c.resetPasswordToken));
        if (!cliente) {
            throw new common_1.BadRequestException('El enlace de recuperación no es válido o venció');
        }
        cliente.password = await bcrypt.hash(passwordNueva, (0, bcrypt_rounds_1.getBcryptRounds)());
        cliente.resetPasswordToken = null;
        cliente.resetPasswordExpires = null;
        cliente.hashedRefreshToken = null;
        await this.clienteRepository.save(cliente);
    }
};
exports.ClientesService = ClientesService;
exports.ClientesService = ClientesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cliente_entity_1.Cliente)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClientesService);
//# sourceMappingURL=clientes.service.js.map