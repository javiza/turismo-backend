import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EmailService } from '../../email/email.service';
import {
  RESERVA_CREADA_EVENT,
  ReservaCreadaEvent,
} from '../../common/events/reserva-creada.event';

/**
 * Reacciona a "reserva.creada" enviando el correo de confirmación al
 * cliente. Vive fuera de ReservasService a propósito: la lógica de negocio
 * de crear una reserva no necesita saber CÓMO se notifica (correo hoy,
 * quizás WhatsApp o push mañana) — solo que "una reserva se creó".
 *
 * @OnEvent por defecto corre de forma asíncrona y no bloquea al emisor;
 * si este listener lanza una excepción, no afecta la respuesta HTTP que
 * ya se envió (la reserva ya está guardada).
 */
@Injectable()
export class ReservaNotificacionesListener {
  private readonly logger = new Logger(ReservaNotificacionesListener.name);

  constructor(private readonly emailService: EmailService) {}

  @OnEvent(RESERVA_CREADA_EVENT, { async: true })
  async enviarConfirmacion(event: ReservaCreadaEvent): Promise<void> {
    if (!event.emailCliente) {
      return;
    }

    try {
      await this.emailService.enviarConfirmacionReserva({
        email: event.emailCliente,
        nombreCliente: event.nombreCliente,
        nombrePaquete: event.nombrePaquete,
        cantidadPersonas: event.cantidadPersonas,
        montoTotal: event.montoTotal,
        fechaInicio: event.fechaInicio,
        fechaFin: event.fechaFin,
      });
    } catch (error) {
      this.logger.error(
        `No se pudo encolar el correo de confirmación de la reserva ${event.reservaId}: ${(error as Error).message}`,
      );
    }
  }
}
