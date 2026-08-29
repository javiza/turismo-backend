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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const event_emitter_1 = require("@nestjs/event-emitter");
const Joi = __importStar(require("joi"));
const throttler_1 = require("@nestjs/throttler");
const database_config_1 = require("./config/database.config");
const logging_module_1 = require("./logging/logging.module");
const redis_module_1 = require("./redis/redis.module");
const storage_module_1 = require("./storage/storage.module");
const queue_module_1 = require("./queue/queue.module");
const health_module_1 = require("./health/health.module");
const metrics_module_1 = require("./metrics/metrics.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const clientes_module_1 = require("./clientes/clientes.module");
const clientes_auth_module_1 = require("./clientes-auth/clientes-auth.module");
const destinos_module_1 = require("./destinos/destinos.module");
const categorias_module_1 = require("./categorias/categorias.module");
const paquetes_module_1 = require("./paquetes/paquetes.module");
const ofertas_module_1 = require("./ofertas/ofertas.module");
const contenido_module_1 = require("./contenido/contenido.module");
const noticias_module_1 = require("./noticias/noticias.module");
const slides_module_1 = require("./slides/slides.module");
const reservas_module_1 = require("./reservas/reservas.module");
const cotizaciones_module_1 = require("./cotizaciones/cotizaciones.module");
const finanzas_module_1 = require("./finanzas/finanzas.module");
const pagos_module_1 = require("./pagos/pagos.module");
const mensajes_module_1 = require("./mensajes/mensajes.module");
const email_module_1 = require("./email/email.module");
const whatsapp_module_1 = require("./whatsapp/whatsapp.module");
const proveedores_module_1 = require("./proveedores/proveedores.module");
const analytics_module_1 = require("./analytics/analytics.module");
const auditoria_module_1 = require("./auditoria/auditoria.module");
const visitas_module_1 = require("./visitas/visitas.module");
const asistente_ia_module_1 = require("./asistente-ia/asistente-ia.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                expandVariables: true,
                envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
                validationSchema: Joi.object({
                    NODE_ENV: Joi.string()
                        .valid('development', 'production', 'test')
                        .default('development'),
                    PORT: Joi.number().default(3000),
                    DB_HOST: Joi.string().required(),
                    DB_PORT: Joi.number().required(),
                    DB_USER: Joi.string().required(),
                    DB_PASSWORD: Joi.string().required(),
                    DB_NAME: Joi.string().required(),
                    JWT_SECRET: Joi.string().required(),
                    JWT_REFRESH_SECRET: Joi.string().required(),
                    JWT_ACCESS_EXPIRES: Joi.string().required(),
                    JWT_REFRESH_EXPIRES: Joi.string().required(),
                    JWT_CLIENTE_SECRET: Joi.string().required(),
                    JWT_CLIENTE_REFRESH_SECRET: Joi.string().required(),
                    JWT_CLIENTE_ACCESS_EXPIRES: Joi.string().required(),
                    JWT_CLIENTE_REFRESH_EXPIRES: Joi.string().required(),
                    SMTP_HOST: Joi.string().allow('').optional(),
                    SMTP_PORT: Joi.number().default(587),
                    SMTP_USER: Joi.string().allow('').optional(),
                    SMTP_PASSWORD: Joi.string().allow('').optional(),
                    SMTP_FROM: Joi.string().required(),
                    ADMIN_NOTIFICATION_EMAIL: Joi.string().email().required(),
                    WHATSAPP_TOKEN: Joi.string().allow('').optional(),
                    WHATSAPP_PHONE_NUMBER_ID: Joi.string().allow('').optional(),
                    WHATSAPP_ADMIN_NUMBER: Joi.string().allow('').optional(),
                    WHATSAPP_API_VERSION: Joi.string().allow('').optional(),
                    TRANSBANK_COMMERCE_CODE: Joi.string().allow('').optional(),
                    TRANSBANK_API_KEY: Joi.string().allow('').optional(),
                    TRANSBANK_ENVIRONMENT: Joi.string()
                        .valid('integration', 'production')
                        .default('integration'),
                    BACKEND_PUBLIC_URL: Joi.string().allow('').optional(),
                    SEED_ADMIN_EMAIL: Joi.string().email().required(),
                    SEED_ADMIN_PASSWORD: Joi.string().required(),
                    SEED_ADMIN_NOMBRE: Joi.string().required(),
                    REDIS_URL: Joi.string().uri().optional(),
                    REDIS_HOST: Joi.string().optional(),
                    REDIS_PORT: Joi.number().optional(),
                    REDIS_PASSWORD: Joi.string().allow('').optional(),
                    CLOUDINARY_CLOUD_NAME: Joi.string().allow('').optional(),
                    CLOUDINARY_API_KEY: Joi.string().allow('').optional(),
                    CLOUDINARY_API_SECRET: Joi.string().allow('').optional(),
                    LOG_LEVEL: Joi.string()
                        .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace')
                        .optional(),
                }),
            }),
            schedule_1.ScheduleModule.forRoot(),
            event_emitter_1.EventEmitterModule.forRoot(),
            logging_module_1.LoggingModule,
            redis_module_1.RedisModule,
            queue_module_1.QueueModule,
            storage_module_1.StorageModule,
            health_module_1.HealthModule,
            metrics_module_1.MetricsModule,
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60_000,
                    limit: 20,
                },
            ]),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: database_config_1.getDatabaseConfig,
            }),
            auth_module_1.AuthModule,
            clientes_auth_module_1.ClientesAuthModule,
            users_module_1.UsersModule,
            clientes_module_1.ClientesModule,
            categorias_module_1.CategoriasModule,
            destinos_module_1.DestinosModule,
            paquetes_module_1.PaquetesModule,
            ofertas_module_1.OfertasModule,
            contenido_module_1.ContenidoModule,
            noticias_module_1.NoticiasModule,
            slides_module_1.SlidesModule,
            reservas_module_1.ReservasModule,
            cotizaciones_module_1.CotizacionesModule,
            finanzas_module_1.FinanzasModule,
            pagos_module_1.PagosModule,
            mensajes_module_1.MensajesModule,
            email_module_1.EmailModule,
            whatsapp_module_1.WhatsappModule,
            proveedores_module_1.ProveedoresModule,
            asistente_ia_module_1.AsistenteIaModule,
            analytics_module_1.AnalyticsModule,
            auditoria_module_1.AuditoriaModule,
            visitas_module_1.VisitasModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map