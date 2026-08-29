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
var TasksScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const tasks_queue_1 = require("./tasks.queue");
const DIAS_RETENCION_AUDITORIA = 180;
const MESES_RETENCION_SERVICIOS_DESACTIVADOS = 6;
let TasksScheduler = TasksScheduler_1 = class TasksScheduler {
    tasksQueue;
    logger = new common_1.Logger(TasksScheduler_1.name);
    constructor(tasksQueue) {
        this.tasksQueue = tasksQueue;
    }
    async encolarLimpiezaAuditoria() {
        this.logger.log('Encolando limpieza de auditoría antigua');
        await this.tasksQueue.add('limpiar-auditoria-antigua', { diasRetencion: DIAS_RETENCION_AUDITORIA }, { attempts: 2, removeOnComplete: { age: 3600 }, removeOnFail: { age: 86_400 } });
    }
    async encolarLimpiezaServiciosDesactivados() {
        this.logger.log('Encolando limpieza de servicios desactivados hace 6+ meses');
        await this.tasksQueue.add('limpiar-servicios-desactivados', { mesesRetencion: MESES_RETENCION_SERVICIOS_DESACTIVADOS }, { attempts: 2, removeOnComplete: { age: 3600 }, removeOnFail: { age: 86_400 } });
    }
};
exports.TasksScheduler = TasksScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_3AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksScheduler.prototype, "encolarLimpiezaAuditoria", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_4AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksScheduler.prototype, "encolarLimpiezaServiciosDesactivados", null);
exports.TasksScheduler = TasksScheduler = TasksScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)(tasks_queue_1.TASKS_QUEUE)),
    __metadata("design:paramtypes", [bullmq_2.Queue])
], TasksScheduler);
//# sourceMappingURL=tasks.scheduler.js.map