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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const nodemailer = __importStar(require("nodemailer"));
const email_queue_1 = require("./email.queue");
let EmailService = EmailService_1 = class EmailService {
    config;
    queue;
    logger = new common_1.Logger(EmailService_1.name);
    transporter;
    fromAddress;
    adminAddress;
    constructor(config, queue) {
        this.config = config;
        this.queue = queue;
        const host = this.config.get('SMTP_HOST');
        const port = Number(this.config.get('SMTP_PORT') ?? 587);
        const user = this.config.get('SMTP_USER');
        const pass = this.config.get('SMTP_PASSWORD');
        this.fromAddress =
            this.config.get('SMTP_FROM') ?? 'no-reply@agencia-viajes.local';
        this.adminAddress =
            this.config.get('ADMIN_NOTIFICATION_EMAIL') ?? this.fromAddress;
        if (!host || !user || !pass) {
            this.logger.warn('SMTP no configurado (faltan SMTP_HOST/SMTP_USER/SMTP_PASSWORD). ' +
                'Los correos se registrarán en el log en vez de enviarse.');
            this.transporter = null;
            return;
        }
        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
        });
    }
    async send(to, subject, html) {
        await this.queue.add('send', { to, subject, html }, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5_000 },
            removeOnComplete: { age: 3600 },
            removeOnFail: { age: 86_400 },
        });
    }
    async sendImmediate(to, subject, html) {
        if (!this.transporter) {
            this.logger.log(`[EMAIL SIMULADO] para=${to} asunto="${subject}"`);
            return;
        }
        await this.transporter.sendMail({
            from: this.fromAddress,
            to,
            subject,
            html,
        });
    }
    async enviarConfirmacionReserva(params) {
        if (!params.email)
            return;
        const monto = params.montoTotal !== undefined
            ? new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP',
            }).format(params.montoTotal)
            : 'a confirmar';
        await this.send(params.email, `Reserva recibida: ${params.nombrePaquete}`, `<h2>¡Gracias por tu reserva, ${params.nombreCliente}!</h2>
       <p>Recibimos tu solicitud para <strong>${params.nombrePaquete}</strong>
       (${params.fechaInicio} al ${params.fechaFin}) para
       ${params.cantidadPersonas} persona(s).</p>
       <p>Monto total estimado: <strong>${monto}</strong></p>
       <p>Tu reserva está <strong>pendiente de confirmación</strong> por
       nuestro equipo. Te contactaremos a la brevedad.</p>`);
    }
    async enviarConfirmacionCotizacion(params) {
        if (!params.email)
            return;
        const sobreQue = params.nombrePaquete
            ? ` para <strong>${params.nombrePaquete}</strong>`
            : params.nombreDestino
                ? ` sobre <strong>${params.nombreDestino}</strong>`
                : params.nombreNoticia
                    ? ` sobre la noticia <strong>${params.nombreNoticia}</strong>`
                    : '';
        await this.send(params.email, 'Recibimos tu solicitud de cotización', `<h2>Hola ${params.nombre},</h2>
       <p>Recibimos tu solicitud de cotización${sobreQue}.</p>
       <p>Nuestro equipo la revisará y te contactará pronto con los
       detalles.</p>`);
    }
    async notificarConsultaEscalada(params) {
        await this.send(this.adminAddress, `[Requiere respuesta] ${params.asunto || 'Consulta de cliente'}`, `<h3>El asistente IA no pudo responder este correo automáticamente</h3>
       <p><strong>De:</strong> ${params.remitente}</p>
       <p><strong>Motivo de escalamiento:</strong> ${params.motivo}</p>
       <p>Revisa el correo directamente en Gmail (quedó marcado como no leído).</p>`);
    }
    async notificarNuevoMensaje(params) {
        await this.send(this.adminAddress, `Nuevo mensaje de contacto${params.asunto ? `: ${params.asunto}` : ''}`, `<h3>Nuevo mensaje desde el formulario de contacto</h3>
       <p><strong>Nombre:</strong> ${params.nombre}</p>
       <p><strong>Correo:</strong> ${params.correo}</p>
       <p><strong>Mensaje:</strong></p>
       <p>${params.mensaje}</p>`);
    }
    async notificarNuevaCotizacion(params) {
        const asuntoRef = params.nombrePaquete || params.nombreDestino || params.nombreNoticia;
        await this.send(this.adminAddress, `Nueva consulta${asuntoRef ? `: ${asuntoRef}` : ''}`, `<h3>Nueva consulta recibida desde el sitio</h3>
       <p><strong>Nombre:</strong> ${params.nombre}</p>
       <p><strong>Correo:</strong> ${params.email}</p>
       ${params.telefono ? `<p><strong>Teléfono:</strong> ${params.telefono}</p>` : ''}
       ${params.nombrePaquete ? `<p><strong>Paquete:</strong> ${params.nombrePaquete}</p>` : ''}
       ${params.nombreDestino ? `<p><strong>Destino:</strong> ${params.nombreDestino}</p>` : ''}
       ${params.nombreNoticia ? `<p><strong>Noticia:</strong> ${params.nombreNoticia}</p>` : ''}
       ${params.cantidadPersonas ? `<p><strong>Personas:</strong> ${params.cantidadPersonas}</p>` : ''}
       <p><strong>Pregunta:</strong></p>
       <p>${params.mensaje || '(sin mensaje)'}</p>`);
    }
    async notificarRespuestaCotizacion(params) {
        if (!params.email)
            return;
        const sobreQue = params.nombrePaquete
            ? ` sobre <strong>${params.nombrePaquete}</strong>`
            : params.nombreDestino
                ? ` sobre <strong>${params.nombreDestino}</strong>`
                : params.nombreNoticia
                    ? ` sobre la noticia <strong>${params.nombreNoticia}</strong>`
                    : '';
        await this.send(params.email, 'Respondimos tu consulta', `<h2>Hola ${params.nombre},</h2>
       <p>Tenemos una respuesta para tu consulta${sobreQue}:</p>
       <blockquote style="border-left:3px solid #e07444;margin:0;padding:8px 16px;color:#333;">
         ${params.respuesta}
       </blockquote>
       <p>Puedes ver el detalle e historial completo iniciando sesión en tu cuenta.</p>`);
    }
    async enviarRecuperacionPassword(params) {
        if (!params.email)
            return;
        await this.send(params.email, 'Recupera tu contraseña', `<h2>Hola ${params.nombre},</h2>
       <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
       <p><a href="${params.resetUrl}" style="display:inline-block;background:#c2410c;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">Restablecer contraseña</a></p>
       <p>Este enlace vence en 1 hora. Si tú no solicitaste esto, puedes ignorar este correo: tu contraseña seguirá siendo la misma.</p>`);
    }
    async notificarProveedorNuevo(params) {
        await this.send(this.adminAddress, 'Proveedor nuevo', `<h3>Nuevo proveedor registrado desde el sitio</h3>
       <p><strong>Negocio:</strong> ${params.nombreNegocio}</p>
       ${params.rubro ? `<p><strong>Rubro:</strong> ${params.rubro}</p>` : ''}
       <p><strong>Contacto:</strong> ${params.nombreContacto}</p>
       <p><strong>Correo:</strong> ${params.correo}</p>
       <p><strong>Teléfono:</strong> ${params.telefono}</p>
       ${params.direccion ? `<p><strong>Dirección:</strong> ${params.direccion}</p>` : ''}
       ${params.precioReferencial !== undefined
            ? `<p><strong>Precio referencial:</strong> $${params.precioReferencial}</p>`
            : ''}
       <p><strong>Descripción del negocio:</strong></p>
       <p>${params.descripcion}</p>`);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)(email_queue_1.EMAIL_QUEUE)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        bullmq_2.Queue])
], EmailService);
//# sourceMappingURL=email.service.js.map