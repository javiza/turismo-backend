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
var GmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const googleapis_1 = require("googleapis");
let GmailService = GmailService_1 = class GmailService {
    config;
    logger = new common_1.Logger(GmailService_1.name);
    gmail = null;
    constructor(config) {
        this.config = config;
    }
    onModuleInit() {
        const clientId = this.config.get('GOOGLE_CLIENT_ID');
        const clientSecret = this.config.get('GOOGLE_CLIENT_SECRET');
        const refreshToken = this.config.get('GOOGLE_REFRESH_TOKEN');
        if (!clientId || !clientSecret || !refreshToken) {
            this.logger.warn('Gmail no configurado (faltan GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET/' +
                'GOOGLE_REFRESH_TOKEN). El asistente de correo queda desactivado.');
            return;
        }
        const oAuth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret);
        oAuth2Client.setCredentials({ refresh_token: refreshToken });
        this.gmail = googleapis_1.google.gmail({ version: 'v1', auth: oAuth2Client });
        this.logger.log('Gmail API inicializada correctamente.');
    }
    estaActivo() {
        return this.gmail !== null;
    }
    async listarNoLeidos(maxResultados = 15) {
        if (!this.gmail)
            return [];
        try {
            const lista = await this.gmail.users.messages.list({
                userId: 'me',
                q: 'is:unread in:inbox -category:promotions -category:social',
                maxResults: maxResultados,
            });
            const ids = lista.data.messages ?? [];
            const correos = [];
            for (const { id } of ids) {
                if (!id)
                    continue;
                const correo = await this.obtenerCorreo(id);
                if (correo)
                    correos.push(correo);
            }
            return correos;
        }
        catch (error) {
            this.logger.error(`Error listando correos no leídos: ${error.message}`);
            return [];
        }
    }
    async obtenerCorreo(id) {
        if (!this.gmail)
            return null;
        try {
            const { data } = await this.gmail.users.messages.get({
                userId: 'me',
                id,
                format: 'full',
            });
            const headers = data.payload?.headers ?? [];
            const remitente = headers.find((h) => h.name === 'From')?.value ?? 'desconocido';
            const asunto = headers.find((h) => h.name === 'Subject')?.value ?? '';
            return {
                id,
                threadId: data.threadId ?? id,
                remitente,
                asunto,
                cuerpo: this.extraerTexto(data.payload),
            };
        }
        catch (error) {
            this.logger.error(`Error obteniendo correo ${id}: ${error.message}`);
            return null;
        }
    }
    extraerTexto(payload) {
        if (!payload)
            return '';
        if (payload.mimeType === 'text/plain' && payload.body?.data) {
            return Buffer.from(payload.body.data, 'base64').toString('utf-8');
        }
        for (const parte of payload.parts ?? []) {
            const texto = this.extraerTexto(parte);
            if (texto)
                return texto;
        }
        if (payload.mimeType === 'text/html' && payload.body?.data) {
            const html = Buffer.from(payload.body.data, 'base64').toString('utf-8');
            return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        }
        return '';
    }
    async responder(params) {
        if (!this.gmail) {
            throw new Error('Gmail no está configurado.');
        }
        const asuntoRespuesta = params.asunto.toLowerCase().startsWith('re:')
            ? params.asunto
            : `Re: ${params.asunto}`;
        const rawMessage = [
            `To: ${params.para}`,
            `Subject: ${asuntoRespuesta}`,
            `In-Reply-To: ${params.messageId}`,
            `References: ${params.messageId}`,
            'Content-Type: text/plain; charset="UTF-8"',
            '',
            params.cuerpo,
        ].join('\n');
        const encoded = Buffer.from(rawMessage)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
        await this.gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encoded,
                threadId: params.threadId,
            },
        });
    }
    async marcarComoLeido(messageId) {
        if (!this.gmail)
            return;
        await this.gmail.users.messages.modify({
            userId: 'me',
            id: messageId,
            requestBody: { removeLabelIds: ['UNREAD'] },
        });
    }
};
exports.GmailService = GmailService;
exports.GmailService = GmailService = GmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GmailService);
//# sourceMappingURL=gmail.service.js.map