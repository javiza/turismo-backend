import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from 'joi';
import {
  ThrottlerModule,
  ThrottlerGuard,
} from '@nestjs/throttler';

// Configuración
import { getDatabaseConfig } from './config/database.config';

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

import { ReservasModule } from './reservas/reservas.module';
import { CotizacionesModule } from './cotizaciones/cotizaciones.module';

import { MensajesModule } from './mensajes/mensajes.module';
import { EmailModule } from './email/email.module';

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
  envFilePath: [
    `.env.${process.env.NODE_ENV}`,
    '.env',
  ],
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

    SEED_ADMIN_EMAIL: Joi.string().email().required(),
    SEED_ADMIN_PASSWORD: Joi.string().required(),
    SEED_ADMIN_NOMBRE: Joi.string().required(),
  }),
}),

    /**
     * Cron Jobs
     */
    ScheduleModule.forRoot(),

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

    /**
     * Operación
     */
    ReservasModule,
    CotizacionesModule,

    /**
     * Comunicación
     */
    MensajesModule,
    EmailModule,

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