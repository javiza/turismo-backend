"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const config_1 = require("@nestjs/config");
const auditoria_module_1 = require("../auditoria/auditoria.module");
const paquetes_module_1 = require("../paquetes/paquetes.module");
const ofertas_module_1 = require("../ofertas/ofertas.module");
const tasks_processor_1 = require("./tasks.processor");
const tasks_scheduler_1 = require("./tasks.scheduler");
const tasks_queue_1 = require("./tasks.queue");
let QueueModule = class QueueModule {
};
exports.QueueModule = QueueModule;
exports.QueueModule = QueueModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const url = config.get('REDIS_URL');
                    return {
                        connection: url
                            ? { url, maxRetriesPerRequest: null }
                            : {
                                host: config.get('REDIS_HOST') ?? 'localhost',
                                port: Number(config.get('REDIS_PORT') ?? 6379),
                                password: config.get('REDIS_PASSWORD') || undefined,
                                maxRetriesPerRequest: null,
                            },
                        defaultJobOptions: {
                            removeOnComplete: { age: 3600, count: 1000 },
                            removeOnFail: { age: 86_400 },
                        },
                    };
                },
            }),
            bullmq_1.BullModule.registerQueue({ name: tasks_queue_1.TASKS_QUEUE }),
            auditoria_module_1.AuditoriaModule,
            paquetes_module_1.PaquetesModule,
            ofertas_module_1.OfertasModule,
        ],
        providers: [tasks_processor_1.TasksProcessor, tasks_scheduler_1.TasksScheduler],
    })
], QueueModule);
//# sourceMappingURL=queue.module.js.map