"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nestjs_pino_1 = require("nestjs-pino");
const crypto_1 = require("crypto");
let LoggingModule = class LoggingModule {
};
exports.LoggingModule = LoggingModule;
exports.LoggingModule = LoggingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_pino_1.LoggerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const esProduccion = config.get('NODE_ENV') === 'production';
                    return {
                        pinoHttp: {
                            level: config.get('LOG_LEVEL') ?? (esProduccion ? 'info' : 'debug'),
                            genReqId: (req) => req.headers['x-request-id'] ?? (0, crypto_1.randomUUID)(),
                            transport: esProduccion
                                ? undefined
                                : {
                                    target: 'pino-pretty',
                                    options: {
                                        colorize: true,
                                        singleLine: true,
                                        translateTime: 'HH:MM:ss',
                                        ignore: 'pid,hostname',
                                    },
                                },
                            redact: {
                                paths: [
                                    'req.headers.authorization',
                                    'req.headers.cookie',
                                    'req.body.password',
                                    'req.body.contrasena',
                                ],
                                censor: '[REDACTADO]',
                            },
                            customLogLevel: (_req, res, err) => {
                                if (err || res.statusCode >= 500)
                                    return 'error';
                                if (res.statusCode >= 400)
                                    return 'warn';
                                return 'info';
                            },
                            serializers: {
                                req: (req) => ({
                                    id: req.id,
                                    method: req.method,
                                    url: req.url,
                                }),
                                res: (res) => ({ statusCode: res.statusCode }),
                            },
                        },
                    };
                },
            }),
        ],
        exports: [nestjs_pino_1.LoggerModule],
    })
], LoggingModule);
//# sourceMappingURL=logging.module.js.map