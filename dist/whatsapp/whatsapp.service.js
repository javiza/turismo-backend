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
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const whatsapp_queue_1 = require("./whatsapp.queue");
const configuracion_service_1 = require("../configuracion/configuracion.service");
let WhatsappService = WhatsappService_1 = class WhatsappService {
    configuracion;
    queue;
    logger = new common_1.Logger(WhatsappService_1.name);
    constructor(configuracion, queue) {
        this.configuracion = configuracion;
        this.queue = queue;
    }
    async getConfig() {
        const cfg = await this.configuracion.obtenerWhatsapp();
        if (!cfg.token || !cfg.phoneNumberId || !cfg.adminNumber) {
            this.logger.warn('WhatsApp Business API no configurada (falta token/phoneNumberId/' +
                'adminNumber, ni en el panel admin ni en .env). Los mensajes se ' +
                'registrarán en el log en vez de enviarse.');
            return { apiUrl: null, token: null, adminNumber: cfg.adminNumber || null };
        }
        return {
            apiUrl: `https://graph.facebook.com/${cfg.apiVersion}/${cfg.phoneNumberId}/messages`,
            token: cfg.token,
            adminNumber: cfg.adminNumber,
        };
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
        const { apiUrl, token } = await this.getConfig();
        if (!apiUrl || !token) {
            this.logger.log(`[WHATSAPP SIMULADO] para=${to} texto="${texto}"`);
            return;
        }
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
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
        const { adminNumber } = await this.getConfig();
        if (!adminNumber) {
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
        await this.enviarTexto(adminNumber, texto);
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = WhatsappService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)(whatsapp_queue_1.WHATSAPP_QUEUE)),
    __metadata("design:paramtypes", [configuracion_service_1.ConfiguracionService,
        bullmq_2.Queue])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map