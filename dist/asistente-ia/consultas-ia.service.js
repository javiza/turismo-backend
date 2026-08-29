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
var ConsultasIaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultasIaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const typeorm_2 = require("typeorm");
const gmail_service_1 = require("./gmail.service");
const ia_service_1 = require("./ia.service");
const consulta_email_entity_1 = require("./entities/consulta-email.entity");
const paquete_entity_1 = require("../paquetes/entities/paquete.entity");
const oferta_entity_1 = require("../ofertas/entities/oferta.entity");
const email_service_1 = require("../email/email.service");
let ConsultasIaService = ConsultasIaService_1 = class ConsultasIaService {
    gmailService;
    iaService;
    emailService;
    consultaRepository;
    paqueteRepository;
    ofertaRepository;
    logger = new common_1.Logger(ConsultasIaService_1.name);
    constructor(gmailService, iaService, emailService, consultaRepository, paqueteRepository, ofertaRepository) {
        this.gmailService = gmailService;
        this.iaService = iaService;
        this.emailService = emailService;
        this.consultaRepository = consultaRepository;
        this.paqueteRepository = paqueteRepository;
        this.ofertaRepository = ofertaRepository;
    }
    async revisarBandejaEntrada() {
        if (!this.gmailService.estaActivo() || !this.iaService.estaActivo()) {
            return;
        }
        let correos = [];
        try {
            correos = await this.gmailService.listarNoLeidos();
        }
        catch (error) {
            this.logger.error(`No se pudo listar correos de Gmail: ${error.message}`);
            return;
        }
        if (correos.length === 0)
            return;
        this.logger.log(`Procesando ${correos.length} correo(s) nuevo(s).`);
        for (const correo of correos) {
            await this.procesarCorreo(correo);
        }
    }
    async procesarCorreo(correo) {
        try {
            const yaExiste = await this.consultaRepository.findOne({
                where: { gmailMessageId: correo.id },
            });
            if (yaExiste) {
                await this.gmailService.marcarComoLeido(correo.id);
                return;
            }
            const contexto = await this.obtenerContextoCatalogo();
            const resultado = await this.iaService.responderConsulta(`Asunto: ${correo.asunto}\n\n${correo.cuerpo}`, contexto);
            if (resultado.confianza === 'alta') {
                await this.gmailService.responder({
                    messageId: correo.id,
                    threadId: correo.threadId,
                    para: correo.remitente,
                    asunto: correo.asunto,
                    cuerpo: resultado.respuesta,
                });
                await this.consultaRepository.save(this.consultaRepository.create({
                    gmailMessageId: correo.id,
                    gmailThreadId: correo.threadId,
                    remitente: correo.remitente,
                    asunto: correo.asunto,
                    cuerpoOriginal: correo.cuerpo,
                    respuesta: resultado.respuesta,
                    estado: consulta_email_entity_1.EstadoConsultaEmail.RESPONDIDA_IA,
                }));
            }
            else {
                await this.consultaRepository.save(this.consultaRepository.create({
                    gmailMessageId: correo.id,
                    gmailThreadId: correo.threadId,
                    remitente: correo.remitente,
                    asunto: correo.asunto,
                    cuerpoOriginal: correo.cuerpo,
                    estado: consulta_email_entity_1.EstadoConsultaEmail.ESCALADA,
                    detalle: resultado.motivo,
                }));
                void this.emailService.notificarConsultaEscalada({
                    remitente: correo.remitente,
                    asunto: correo.asunto,
                    motivo: resultado.motivo,
                });
                return;
            }
            await this.gmailService.marcarComoLeido(correo.id);
        }
        catch (error) {
            this.logger.error(`Error procesando correo ${correo.id}: ${error.message}`);
            await this.consultaRepository
                .save(this.consultaRepository.create({
                gmailMessageId: correo.id,
                gmailThreadId: correo.threadId,
                remitente: correo.remitente,
                asunto: correo.asunto,
                cuerpoOriginal: correo.cuerpo,
                estado: consulta_email_entity_1.EstadoConsultaEmail.ERROR,
                detalle: error.message,
            }))
                .catch((errorGuardado) => this.logger.error(`No se pudo guardar el registro de error: ${errorGuardado.message}`));
        }
    }
    async obtenerContextoCatalogo() {
        const [paquetes, ofertas] = await Promise.all([
            this.paqueteRepository.find({
                where: { activo: true },
                relations: ['destino'],
                take: 50,
            }),
            this.ofertaRepository.find({
                where: { activa: true },
                take: 20,
            }),
        ]);
        return {
            paquetes: paquetes.map((p) => ({
                nombre: p.nombre,
                destino: p.destino?.nombre ?? '',
                precio: p.precio,
                cupos: p.cupos,
                fechaInicio: p.fechaInicio,
                fechaFin: p.fechaFin,
            })),
            ofertas: ofertas.map((o) => ({
                nombre: o.titulo,
                descuento: o.descuento,
                vigenciaFin: o.fechaFin,
            })),
        };
    }
    async findEscaladas() {
        return this.consultaRepository.find({
            where: [
                { estado: consulta_email_entity_1.EstadoConsultaEmail.ESCALADA },
                { estado: consulta_email_entity_1.EstadoConsultaEmail.ERROR },
            ],
            order: { createdAt: 'DESC' },
        });
    }
    async findAll() {
        return this.consultaRepository.find({ order: { createdAt: 'DESC' } });
    }
};
exports.ConsultasIaService = ConsultasIaService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConsultasIaService.prototype, "revisarBandejaEntrada", null);
exports.ConsultasIaService = ConsultasIaService = ConsultasIaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(consulta_email_entity_1.ConsultaEmail)),
    __param(4, (0, typeorm_1.InjectRepository)(paquete_entity_1.Paquete)),
    __param(5, (0, typeorm_1.InjectRepository)(oferta_entity_1.Oferta)),
    __metadata("design:paramtypes", [gmail_service_1.GmailService,
        ia_service_1.IaService,
        email_service_1.EmailService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ConsultasIaService);
//# sourceMappingURL=consultas-ia.service.js.map