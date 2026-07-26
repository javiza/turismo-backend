import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';

/**
 * Logging estructurado (JSON) con Pino, en vez del Logger por defecto de
 * Nest (que solo imprime texto plano). Beneficios concretos:
 * - Cada línea es JSON parseable por Railway/Render/Datadog/Loki/etc.
 * - Cada request trae un requestId (X-Request-Id) que aparece en TODOS
 *   los logs de esa request, incluidos los que vienen de queues/eventos
 *   si se propaga (ver nota abajo).
 * - En desarrollo se ve legible gracias a pino-pretty; en producción sale
 *   JSON puro (más rápido y parseable), controlado por NODE_ENV.
 *
 * No se loguea el body completo de la request (puede traer contraseñas,
 * tokens) — solo método, url, status y duración.
 */
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const esProduccion = config.get<string>('NODE_ENV') === 'production';

        return {
          pinoHttp: {
            level: config.get<string>('LOG_LEVEL') ?? (esProduccion ? 'info' : 'debug'),
            genReqId: (req: any) =>
              req.headers['x-request-id'] ?? randomUUID(),
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
              if (err || res.statusCode >= 500) return 'error';
              if (res.statusCode >= 400) return 'warn';
              return 'info';
            },
            serializers: {
              req: (req: any) => ({
                id: req.id,
                method: req.method,
                url: req.url,
              }),
              res: (res: any) => ({ statusCode: res.statusCode }),
            },
          },
        };
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggingModule {}
