import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuditoriaModule } from '../auditoria/auditoria.module';
import { PaquetesModule } from '../paquetes/paquetes.module';
import { OfertasModule } from '../ofertas/ofertas.module';
import { TasksProcessor } from './tasks.processor';
import { TasksScheduler } from './tasks.scheduler';
import { TASKS_QUEUE } from './tasks.queue';

/**
 * Configura la conexión Redis que usan TODAS las colas de la app (esta y
 * las declaradas en EmailModule/WhatsappModule vía BullModule.registerQueue).
 * Se hace acá, en un único forRootAsync, para no repetir la config de
 * conexión en cada módulo.
 */
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('REDIS_URL');

        return {
          connection: url
            ? { url, maxRetriesPerRequest: null }
            : {
                host: config.get<string>('REDIS_HOST') ?? 'localhost',
                port: Number(config.get<string>('REDIS_PORT') ?? 6379),
                password: config.get<string>('REDIS_PASSWORD') || undefined,
                maxRetriesPerRequest: null,
              },
          defaultJobOptions: {
            removeOnComplete: { age: 3600, count: 1000 },
            removeOnFail: { age: 86_400 },
          },
        };
      },
    }),
    BullModule.registerQueue({ name: TASKS_QUEUE }),
    AuditoriaModule,
    PaquetesModule,
    OfertasModule,
  ],
  providers: [TasksProcessor, TasksScheduler],
})
export class QueueModule {}
