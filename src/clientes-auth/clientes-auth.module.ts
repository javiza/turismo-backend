import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ClientesAuthController } from './clientes-auth.controller';
import { ClientesAuthService } from './clientes-auth.service';
import { JwtClienteStrategy } from './strategies/jwt-cliente.strategy';
import { ClientesModule } from '../clientes/clientes.module';
import { ReservasModule } from '../reservas/reservas.module';
import { CotizacionesModule } from '../cotizaciones/cotizaciones.module';

@Module({
  imports: [
    ClientesModule,
    ReservasModule,
    CotizacionesModule,
    PassportModule,
    // registerAsync + su propio secret (JWT_CLIENTE_SECRET, distinto del
    // JWT_SECRET de admins): un token de cliente firmado acá jamás va a
    // validar contra la estrategia de admin, ni al revés.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_CLIENTE_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [ClientesAuthController],
  providers: [ClientesAuthService, JwtClienteStrategy],
  exports: [ClientesAuthService],
})
export class ClientesAuthModule {}
