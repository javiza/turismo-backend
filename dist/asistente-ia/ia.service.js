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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var IaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
let IaService = IaService_1 = class IaService {
    config;
    logger = new common_1.Logger(IaService_1.name);
    client;
    constructor(config) {
        this.config = config;
        const apiKey = this.config.get('ANTHROPIC_API_KEY');
        if (!apiKey) {
            this.logger.warn('ANTHROPIC_API_KEY no configurada. El asistente de correo no podrá generar respuestas.');
            this.client = null;
            return;
        }
        this.client = new sdk_1.default({ apiKey });
    }
    estaActivo() {
        return this.client !== null;
    }
    async responderConsulta(pregunta, contexto) {
        if (!this.client) {
            return { confianza: 'baja', motivo: 'IA no configurada' };
        }
        const systemPrompt = `Eres el asistente de correo de una agencia de turismo chilena.
Tu única función es leer la consulta de un cliente y decidir si se puede
responder con certeza usando SOLO los datos de catálogo entregados abajo.

Responde EXCLUSIVAMENTE en JSON, sin texto adicional, con esta forma:
{"confianza": "alta", "respuesta": "..."} si puedes responder con certeza
{"confianza": "baja", "motivo": "..."} si no puedes

Marca "baja" siempre que la consulta trate sobre: una reserva ya realizada,
pagos o reembolsos, reclamos, datos personales, disponibilidad no listada
en el catálogo, o cualquier cosa ambigua. Marca "baja" también si el
catálogo no tiene la información para responder con exactitud — NUNCA
inventes precios, fechas o cupos.

Si marcas "alta", la respuesta debe ser breve, cordial, en español de
Chile, firmada como "Equipo de reservas".

Catálogo vigente (JSON): ${JSON.stringify(contexto)}`;
        try {
            const mensaje = await this.client.messages.create({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 600,
                system: systemPrompt,
                messages: [{ role: 'user', content: pregunta }],
            });
            const bloqueTexto = mensaje.content.find((b) => b.type === 'text');
            if (!bloqueTexto || bloqueTexto.type !== 'text') {
                return { confianza: 'baja', motivo: 'Respuesta de IA sin texto' };
            }
            return this.parsearRespuesta(bloqueTexto.text);
        }
        catch (error) {
            this.logger.error(`Error llamando a la API de Anthropic: ${error.message}`);
            return { confianza: 'baja', motivo: 'Error al consultar la IA' };
        }
    }
    parsearRespuesta(texto) {
        try {
            const limpio = texto.replace(/```json|```/g, '').trim();
            const parseado = JSON.parse(limpio);
            if (parseado.confianza === 'alta' &&
                typeof parseado.respuesta === 'string' &&
                parseado.respuesta.length > 0) {
                return parseado;
            }
            if (parseado.confianza === 'baja') {
                return {
                    confianza: 'baja',
                    motivo: parseado.motivo ?? 'Sin motivo especificado',
                };
            }
            return { confianza: 'baja', motivo: 'JSON de IA con forma inesperada' };
        }
        catch {
            return {
                confianza: 'baja',
                motivo: 'No se pudo interpretar la respuesta de la IA',
            };
        }
    }
};
exports.IaService = IaService;
exports.IaService = IaService = IaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], IaService);
//# sourceMappingURL=ia.service.js.map