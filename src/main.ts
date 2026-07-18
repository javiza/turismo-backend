import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  /*
   |--------------------------------------------------------------------------
   | Seguridad
   |--------------------------------------------------------------------------
   */

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  /*
   |--------------------------------------------------------------------------
   | CORS
   |--------------------------------------------------------------------------
   */

  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN')?.split(',') ?? true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  /*
   |--------------------------------------------------------------------------
   | API
   |--------------------------------------------------------------------------
   */

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  /*
   |--------------------------------------------------------------------------
   | Pipes
   |--------------------------------------------------------------------------
   */

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      stopAtFirstError: true,
    }),
  );

  /*
   |--------------------------------------------------------------------------
   | Filtros
   |--------------------------------------------------------------------------
   */

  app.useGlobalFilters(new AllExceptionsFilter());

  /*
   |--------------------------------------------------------------------------
   | Serialización
   |--------------------------------------------------------------------------
   */

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  /*
   |--------------------------------------------------------------------------
   | Swagger
   |--------------------------------------------------------------------------
   */

  if (configService.get('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Tourism API')
      .setDescription('API para Agencia de Turismo')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
        },
        'JWT-auth',
      )
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
          description: 'JWT del Cliente',
        },
        'JWT-cliente',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  /*
   |--------------------------------------------------------------------------
   | Cierre limpio
   |--------------------------------------------------------------------------
   */

  app.enableShutdownHooks();

  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);

  console.log('==========================================');
  console.log('🚀 Tourism Backend iniciado correctamente');
  console.log(`🌐 API: http://localhost:${port}/api/v1`);
  console.log(`📘 Swagger: http://localhost:${port}/docs`);
  console.log('==========================================');
}

bootstrap();