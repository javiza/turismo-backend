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
var WhatsappService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const whatsapp_queue_1 = require("./whatsapp.queue");
let WhatsappService = WhatsappService_1 = class WhatsappService {
    config;
    queue;
    logger = new common_1.Logger(WhatsappService_1.name);
    apiUrl;
    token;
    adminNumber;
    constructor(config, queue) {
        this.config = config;
        this.queue = queue;
        const token = this.config.get('WHATSAPP_TOKEN');
        const phoneNumberId = this.config.get('WHATSAPP_PHONE_NUMBER_ID');
        const adminNumber = this.config.get('WHATSAPP_ADMIN_NUMBER');
        const apiVersion = this.config.get('WHATSAPP_API_VERSION') ?? 'v20.0';
        if (!token || !phoneNumberId || !adminNumber) {
            this.logger.warn('WhatsApp Business API no configurada (faltan WHATSAPP_TOKEN/' +
                'WHATSAPP_PHONE_NUMBER_ID/WHATSAPP_ADMIN_NUMBER). Los mensajes ' +
                'se registrarán en el log en vez de enviarse.');
            this.apiUrl = null;
            this.token = null;
            this.adminNumber = null;
            return;
        }
        this.apiUrl = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;
        this.token = token;
        this.adminNumber = adminNumber;
    }
    async enviarTexto(to, texto) {
        await this.queue.add('send', { to, texto }, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5_000 },
            removeOnComplete: { age: 3600 },
            removeOnFail: { age: 86_400 },
        });
    }
    async enviarTextoImmediate(to, texto) {
        if (!this.apiUrl || !this.token) {
            this.logger.log(`[WHATSAPP SIMULADO] para=${to} texto="${texto}"`);
            return;
        }
        const res = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to,
                type: 'text',
                text: { body: texto },
            }),
        });
        if (!res.ok) {
            const detalle = await res.text();
            throw new Error(`HTTP ${res.status}: ${detalle}`);
        }
    }
    async notificarProveedorNuevo(params) {
        if (!this.adminNumber) {
            this.logger.log(`[WHATSAPP SIMULADO] Proveedor nuevo: ${params.nombreNegocio}`);
            return;
        }
        const texto = `*Proveedor nuevo*\n` +
            `Negocio: ${params.nombreNegocio}\n` +
            (params.rubro ? `Rubro: ${params.rubro}\n` : '') +
            `Contacto: ${params.nombreContacto}\n` +
            `Teléfono: ${params.telefono}\n` +
            `Correo: ${params.correo}\n` +
            `Revisa el detalle completo en el panel admin.`;
        await this.enviarTexto(this.adminNumber, texto);
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = WhatsappService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)(whatsapp_queue_1.WHATSAPP_QUEUE)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        bullmq_2.Queue])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map