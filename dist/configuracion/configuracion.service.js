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
var ConfiguracionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfiguracionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const configuracion_integracion_entity_1 = require("./entities/configuracion-integracion.entity");
const crypto_util_1 = require("../common/utils/crypto.util");
let ConfiguracionService = ConfiguracionService_1 = class ConfiguracionService {
    repo;
    env;
    logger = new common_1.Logger(ConfiguracionService_1.name);
    constructor(repo, env) {
        this.repo = repo;
        this.env = env;
    }
    async obtenerJson(clave) {
        const fila = await this.repo.findOne({ where: { clave } });
        if (!fila)
            return null;
        try {
            return JSON.parse((0, crypto_util_1.descifrar)(fila.valorCifrado));
        }
        catch (err) {
            this.logger.error(`No se pudo descifrar la configuración de "${clave}". ¿Cambió CONFIG_ENCRYPTION_KEY? ${err}`);
            return null;
        }
    }
    async guardar(clave, data, adminId) {
        const valorCifrado = (0, crypto_util_1.cifrar)(JSON.stringify(data));
        const existente = await this.repo.findOne({ where: { clave } });
        if (existente) {
            existente.valorCifrado = valorCifrado;
            existente.actualizadoPorId = adminId;
            await this.repo.save(existente);
        }
        else {
            await this.repo.save(this.repo.create({ clave, valorCifrado, actualizadoPorId: adminId }));
        }
    }
    async obtenerEstado(clave) {
        const fila = await this.repo.findOne({ where: { clave } });
        return { configuradoEnDb: !!fila, actualizadoEn: fila?.updatedAt };
    }
    async obtenerSmtp() {
        const guardado = await this.obtenerJson(configuracion_integracion_entity_1.ClaveIntegracion.SMTP);
        return {
            host: guardado?.host ?? this.env.get('SMTP_HOST') ?? '',
            port: guardado?.port ?? Number(this.env.get('SMTP_PORT') ?? 587),
            user: guardado?.user ?? this.env.get('SMTP_USER') ?? '',
            password: guardado?.password ?? this.env.get('SMTP_PASSWORD') ?? '',
            from: guardado?.from ?? this.env.get('SMTP_FROM') ?? 'no-reply@agencia-viajes.local',
            adminEmail: guardado?.adminEmail ?? this.env.get('ADMIN_NOTIFICATION_EMAIL') ?? '',
        };
    }
    async obtenerWhatsapp() {
        const guardado = await this.obtenerJson(configuracion_integracion_entity_1.ClaveIntegracion.WHATSAPP);
        return {
            token: guardado?.token ?? this.env.get('WHATSAPP_TOKEN') ?? '',
            phoneNumberId: guardado?.phoneNumberId ?? this.env.get('WHATSAPP_PHONE_NUMBER_ID') ?? '',
            adminNumber: guardado?.adminNumber ?? this.env.get('WHATSAPP_ADMIN_NUMBER') ?? '',
            apiVersion: guardado?.apiVersion ?? this.env.get('WHATSAPP_API_VERSION') ?? 'v20.0',
        };
    }
    async obtenerTransbank() {
        const guardado = await this.obtenerJson(configuracion_integracion_entity_1.ClaveIntegracion.TRANSBANK);
        return {
            commerceCode: guardado?.commerceCode ?? this.env.get('TRANSBANK_COMMERCE_CODE') ?? '',
            apiKey: guardado?.apiKey ?? this.env.get('TRANSBANK_API_KEY') ?? '',
            environment: guardado?.environment ??
                this.env.get('TRANSBANK_ENVIRONMENT') ??
                'integration',
        };
    }
    async obtenerMercadoPago() {
        const guardado = await this.obtenerJson(configuracion_integracion_entity_1.ClaveIntegracion.MERCADOPAGO);
        return {
            accessToken: guardado?.accessToken ?? this.env.get('MERCADOPAGO_ACCESS_TOKEN') ?? '',
            publicKey: guardado?.publicKey ?? this.env.get('MERCADOPAGO_PUBLIC_KEY') ?? '',
        };
    }
};
exports.ConfiguracionService = ConfiguracionService;
exports.ConfiguracionService = ConfiguracionService = ConfiguracionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(configuracion_integracion_entity_1.ConfiguracionIntegracion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], ConfiguracionService);
//# sourceMappingURL=configuracion.service.js.map