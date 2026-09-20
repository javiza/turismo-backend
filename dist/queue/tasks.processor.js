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
var TasksProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksProcessor = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const tasks_queue_1 = require("./tasks.queue");
const auditoria_service_1 = require("../auditoria/auditoria.service");
const paquetes_service_1 = require("../paquetes/paquetes.service");
const ofertas_service_1 = require("../ofertas/ofertas.service");
let TasksProcessor = TasksProcessor_1 = class TasksProcessor extends bullmq_1.WorkerHost {
    auditoriaService;
    paquetesService;
    ofertasService;
    logger = new common_1.Logger(TasksProcessor_1.name);
    constructor(auditoriaService, paquetesService, ofertasService) {
        super();
        this.auditoriaService = auditoriaService;
        this.paquetesService = paquetesService;
        this.ofertasService = ofertasService;
    }
    async process(job) {
        switch (job.name) {
            case 'limpiar-auditoria-antigua':
                return this.limpiarAuditoriaAntigua(job.data);
            case 'limpiar-servicios-desactivados':
                return this.limpiarServiciosDesactivados(job.data);
            default:
                this.logger.warn(`Job desconocido en cola 'tasks': ${job.name}`);
        }
    }
    async limpiarAuditoriaAntigua(data) {
        const borrados = await this.auditoriaService.limpiarAntiguos(data.diasRetencion);
        this.logger.log(`Limpieza de auditoría: ${borrados} registro(s) mayores a ${data.diasRetencion} días eliminados`);
    }
    async limpiarServiciosDesactivados(data) {
        const [paquetesBorrados, ofertasBorradas] = await Promise.all([
            this.paquetesService.limpiarDesactivadosAntiguos(data.mesesRetencion),
            this.ofertasService.limpiarDesactivadasAntiguas(data.mesesRetencion),
        ]);
        this.logger.log(`Limpieza de servicios desactivados (${data.mesesRetencion}+ meses): ` +
            `${paquetesBorrados} paquete(s) y ${ofertasBorradas} oferta(s) eliminados definitivamente`);
    }
};
exports.TasksProcessor = TasksProcessor;
exports.TasksProcessor = TasksProcessor = TasksProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(tasks_queue_1.TASKS_QUEUE),
    __metadata("design:paramtypes", [auditoria_service_1.AuditoriaService,
        paquetes_service_1.PaquetesService,
        ofertas_service_1.OfertasService])
], TasksProcessor);
//# sourceMappingURL=tasks.processor.js.map