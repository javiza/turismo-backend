import { Module } from '@nestjs/common';

import { JwtModule, JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';

import { ConfigModule } from '@nestjs/config';

import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { JwtStrategy } from './strategies/jwt.strategy';

import { UsersModule } from '../users/users.module';


@Module({
  imports: [
    UsersModule,

    PassportModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (
        config: ConfigService,
      ): JwtModuleOptions => ({
        secret:
          config.getOrThrow<string>(
            'JWT_SECRET',
          ),

        signOptions: {
          // Antes estaba hardcodeado en '1d', ignorando JWT_ACCESS_EXPIRES
          // del .env — quedaban dos lugares que "controlaban" el tiempo de
          // expiración del access token, y solo uno de los dos hacía algo
          // de verdad (AuthService.getTokens() ya lo pasaba explícito en
          // cada sign(), pisando este default). Ahora hay un solo valor.
          expiresIn: config.getOrThrow<string>(
            'JWT_ACCESS_EXPIRES',
          ) as JwtSignOptions['expiresIn'],
        },
      }),
    }),
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    JwtStrategy,
  ],

  exports: [
    AuthService,
  ],
})
export class AuthModule {}