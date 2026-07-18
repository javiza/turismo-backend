import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository } from 'typeorm';

import { GmailService, CorreoEntrante } from './gmail.service';
import { IaService } from './ia.service';
import {
  ConsultaEmail,
  EstadoConsultaEmail,
} from './entities/consulta-email.entity';
import { Paquete } from '../paquetes/entities/paquete.entity';
import { Oferta } from '../ofertas/entities/oferta.entity';
import { EmailService } from '../email/email.service';

/**
 * Orquesta el flujo completo: Gmail -> catálogo -> IA -> respuesta/escalamiento.
 *
 * Diseño: cada correo se procesa de forma independiente y con su propio
 * try/catch. Si uno falla (Gmail caído, IA caída, lo que sea), no debe
 * tumbar el procesamiento de los demás correos ni el cron completo — por
 * eso el error se captura, se registra en `consultas_email` con estado
 * ERROR, y se sigue con el siguiente correo. El correo que falló queda
 * como no leído en Gmail, así que se reintenta solo en la próxima corrida.
 */
@Injectable()
export class ConsultasIaService {
  private readonly logger = new Logger(ConsultasIaService.name);

  constructor(
    private readonly gmailService: GmailService,
    private readonly iaService: IaService,
    private readonly emailService: EmailService,
    @InjectRepository(ConsultaEmail)
    private readonly consultaRepository: Repository<ConsultaEmail>,
    @InjectRepository(Paquete)
    private readonly paqueteRepository: Repository<Paquete>,
    @InjectRepository(Oferta)
    private readonly ofertaRepository: Repository<Oferta>,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async revisarBandejaEntrada(): Promise<void> {
    if (!this.gmailService.estaActivo() || !this.iaService.estaActivo()) {
      // Sin credenciales configuradas: no hay nada que hacer. No se loguea
      // como error en cada corrida para no ensuciar los logs; el warning
      // ya se mostró una vez al levantar la app (ver GmailService/IaService).
      return;
    }

    let correos: CorreoEntrante[] = [];
    try {
      correos = await this.gmailService.listarNoLeidos();
    } catch (error) {
      this.logger.error(
        `No se pudo listar correos de Gmail: ${(error as Error).message}`,
      );
      return;
    }

    if (correos.length === 0) return;

    this.logger.log(`Procesando ${correos.length} correo(s) nuevo(s).`);

    for (const correo of correos) {
      await this.procesarCorreo(correo);
    }
  }

  private async procesarCorreo(correo: CorreoEntrante): Promise<void> {
    try {
      const yaExiste = await this.consultaRepository.findOne({
        where: { gmailMessageId: correo.id },
      });
      if (yaExiste) {
        // Ya procesado en una corrida anterior; solo falta marcarlo leído
        // (pudo quedar sin marcar si el proceso se cayó justo después de
        // guardar el registro pero antes de llamar a Gmail).
        await this.gmailService.marcarComoLeido(correo.id);
        return;
      }

      const contexto = await this.obtenerContextoCatalogo();
      const resultado = await this.iaService.responderConsulta(
        `Asunto: ${correo.asunto}\n\n${correo.cuerpo}`,
        contexto,
      );

      if (resultado.confianza === 'alta') {
        await this.gmailService.responder({
          messageId: correo.id,
          threadId: correo.threadId,
          para: correo.remitente,
          asunto: correo.asunto,
          cuerpo: resultado.respuesta,
        });

        await this.consultaRepository.save(
          this.consultaRepository.create({
            gmailMessageId: correo.id,
            gmailThreadId: correo.threadId,
            remitente: correo.remitente,
            asunto: correo.asunto,
            cuerpoOriginal: correo.cuerpo,
            respuesta: resultado.respuesta,
            estado: EstadoConsultaEmail.RESPONDIDA_IA,
          }),
        );
      } else {
        await this.consultaRepository.save(
          this.consultaRepository.create({
            gmailMessageId: correo.id,
            gmailThreadId: correo.threadId,
            remitente: correo.remitente,
            asunto: correo.asunto,
            cuerpoOriginal: correo.cuerpo,
            estado: EstadoConsultaEmail.ESCALADA,
            detalle: resultado.motivo,
          }),
        );

        // El aviso al admin no debe bloquear el flujo si falla; EmailService
        // ya maneja ese caso internamente (solo loguea el error).
        void this.emailService.notificarConsultaEscalada({
          remitente: correo.remitente,
          asunto: correo.asunto,
          motivo: resultado.motivo,
        });

        // A propósito NO se marca como leído: así queda visible en la
        // bandeja real de Gmail para que una persona lo vea y responda.
        return;
      }

      await this.gmailService.marcarComoLeido(correo.id);
    } catch (error) {
      this.logger.error(
        `Error procesando correo ${correo.id}: ${(error as Error).message}`,
      );

      await this.consultaRepository
        .save(
          this.consultaRepository.create({
            gmailMessageId: correo.id,
            gmailThreadId: correo.threadId,
            remitente: correo.remitente,
            asunto: correo.asunto,
            cuerpoOriginal: correo.cuerpo,
            estado: EstadoConsultaEmail.ERROR,
            detalle: (error as Error).message,
          }),
        )
        // Si hasta guardar el log de error falla (ej. Postgres caído), no
        // hay más que hacer que dejar constancia en el log de la app.
        .catch((errorGuardado) =>
          this.logger.error(
            `No se pudo guardar el registro de error: ${
              (errorGuardado as Error).message
            }`,
          ),
        );
    }
  }

  /** Catálogo vigente y acotado: solo paquetes activos y ofertas vigentes, lo mínimo que la IA necesita para no alucinar datos. */
  private async obtenerContextoCatalogo() {
    const [paquetes, ofertas] = await Promise.all([
      this.paqueteRepository.find({
        where: { activo: true },
        relations: ['destino'],
        take: 50,
      }),
      this.ofertaRepository.find({
        where: { activa: true },
        take: 20,
      }),
    ]);

    return {
      paquetes: paquetes.map((p) => ({
        nombre: p.nombre,
        destino: p.destino?.nombre ?? '',
        precio: p.precio,
        cupos: p.cupos,
        fechaInicio: p.fechaInicio,
        fechaFin: p.fechaFin,
      })),
      ofertas: ofertas.map((o) => ({
        nombre: o.titulo,
        descuento: o.descuento,
        vigenciaFin: o.fechaFin,
      })),
    };
  }

  /** Consultas escaladas o con error, para mostrar en el panel admin. */
  async findEscaladas(): Promise<ConsultaEmail[]> {
    return this.consultaRepository.find({
      where: [
        { estado: EstadoConsultaEmail.ESCALADA },
        { estado: EstadoConsultaEmail.ERROR },
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<ConsultaEmail[]> {
    return this.consultaRepository.find({ order: { createdAt: 'DESC' } });
  }
}
