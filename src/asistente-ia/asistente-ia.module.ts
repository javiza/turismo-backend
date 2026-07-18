import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GmailService } from './gmail.service';
import { IaService } from './ia.service';
import { ConsultasIaService } from './consultas-ia.service';
import { ConsultasIaController } from './consultas-ia.controller';
import { ConsultaEmail } from './entities/consulta-email.entity';
import { Paquete } from '../paquetes/entities/paquete.entity';
import { Oferta } from '../ofertas/entities/oferta.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsultaEmail, Paquete, Oferta]),
    EmailModule,
  ],
  controllers: [ConsultasIaController],
  providers: [GmailService, IaService, ConsultasIaService],
  exports: [ConsultasIaService],
})
export class AsistenteIaModule {}
