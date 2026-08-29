import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import * as Joi from 'joi';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

// Configuración
import { getDatabaseConfig } from './config/database.config';

// Infraestructura
import { LoggingModule } from './logging/logging.module';
import { RedisModule } from './redis/redis.module';
import { StorageModule } from './storage/storage.module';
import { QueueModule } from './queue/queue.module';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';

// Módulos
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClientesModule } from './clientes/clientes.module';
import { ClientesAuthModule } from './clientes-auth/clientes-auth.module';

import { DestinosModule } from './destinos/destinos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { PaquetesModule } from './paquetes/paquetes.module';
import { OfertasModule } from './ofertas/ofertas.module';
import { ContenidoModule } from './contenido/contenido.module';
import { NoticiasModule } from './noticias/noticias.module';
import { SlidesModule } from './slides/slides.module';

import { ReservasModule } from './reservas/reservas.module';
import { CotizacionesModule } from './cotizaciones/cotizaciones.module';
import { FinanzasModule } from './finanzas/finanzas.module';
import { PagosModule } from './pagos/pagos.module';

import { MensajesModule } from './mensajes/mensajes.module';
import { EmailModule } from './email/email.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { ProveedoresModule } from './proveedores/proveedores.module';

import { AnalyticsModule } from './analytics/analytics.module';
import { AuditoriaModule } from './auditoria/auditoria.module';

import { VisitasModule } from './visitas/visitas.module';

import { AsistenteIaModule } from './asistente-ia/asistente-ia.module';

// Filtros (crear más adelante)
// import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

@Module({
  imports: [
    /**
     * Variables de entorno
     */
    ConfigModule.forRoot({
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

        // Transbank Webpay Plus (pago con tarjeta). Si se dejan vacías en
        // desarrollo, PagosService usa las credenciales de integración
        // públicas de Transbank (ambiente de pruebas). En producción son
        // obligatorias — ver validación adicional en PagosService.
        TRANSBANK_COMMERCE_CODE: Joi.string().allow('').optional(),
        TRANSBANK_API_KEY: Joi.string().allow('').optional(),
        TRANSBANK_ENVIRONMENT: Joi.string()
          .valid('integration', 'production')
          .default('integration'),
        // URL pública por la que Transbank puede alcanzar este backend
        // para redirigir al cliente de vuelta tras pagar (returnUrl). En
        // desarrollo con localhost no importa; en producción debe ser la
        // URL real y accesible desde internet del backend.
        BACKEND_PUBLIC_URL: Joi.string().allow('').optional(),

        SEED_ADMIN_EMAIL: Joi.string().email().required(),
        SEED_ADMIN_PASSWORD: Joi.string().required(),
        SEED_ADMIN_NOMBRE: Joi.string().required(),

        // Redis (caché + BullMQ). REDIS_URL tiene prioridad si está presente
        // (formato típico de Railway/Render: redis://user:pass@host:puerto).
        REDIS_URL: Joi.string().uri().optional(),
        REDIS_HOST: Joi.string().optional(),
        REDIS_PORT: Joi.number().optional(),
        REDIS_PASSWORD: Joi.string().allow('').optional(),

        // Cloudinary (subida de imágenes)
        CLOUDINARY_CLOUD_NAME: Joi.string().allow('').optional(),
        CLOUDINARY_API_KEY: Joi.string().allow('').optional(),
        CLOUDINARY_API_SECRET: Joi.string().allow('').optional(),

        // Logging estructurado
        LOG_LEVEL: Joi.string()
          .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace')
          .optional(),
      }),
    }),

    /**
     * Cron Jobs
     */
    ScheduleModule.forRoot(),

    /**
     * Eventos de dominio internos (desacopla notificaciones de la lógica
     * de negocio; ver src/common/events/*).
     */
    EventEmitterModule.forRoot(),

    /**
     * Logging estructurado (Pino)
     */
    LoggingModule,

    /**
     * Redis: caché de aplicación (Global, ver RedisModule)
     */
    RedisModule,

    /**
     * Colas en segundo plano (BullMQ), sobre la misma conexión Redis
     */
    QueueModule,

    /**
     * Almacenamiento de imágenes (Cloudinary)
     */
    StorageModule,

    /**
     * Salud y métricas
     */
    HealthModule,
    MetricsModule,

    /**
     * Protección contra ataques de fuerza bruta
     */
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 20,
      },
    ]),

    /**
     * Base de datos
     */
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),

    /**
     * Autenticación
     */
    AuthModule,
    ClientesAuthModule,

    /**
     * Usuarios
     */
    UsersModule,
    ClientesModule,

    /**
     * Catálogo
     */
    CategoriasModule,
    DestinosModule,
    PaquetesModule,
    OfertasModule,
    ContenidoModule,
    NoticiasModule,
    SlidesModule,

    /**
     * Operación
     */
    ReservasModule,
    CotizacionesModule,
    FinanzasModule,
    PagosModule,

    /**
     * Comunicación
     */
    MensajesModule,
    EmailModule,
    WhatsappModule,

    /**
     * Proveedores
     */
    ProveedoresModule,

    /**
     * Inteligencia Artificial
     */
    AsistenteIaModule,

    /**
     * Estadísticas
     */
    AnalyticsModule,
    AuditoriaModule,
    VisitasModule,
  ],

  providers: [
    /**
     * Rate Limiting Global
     */
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    /**
     * Filtro global de excepciones
     * (Descomentar cuando esté creado)
     */
    /*
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    */
  ],
})
export class AppModule {}
