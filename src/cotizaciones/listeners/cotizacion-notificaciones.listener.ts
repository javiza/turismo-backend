import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EmailService } from '../../email/email.service';
import {
  COTIZACION_CREADA_EVENT,
  COTIZACION_RESPONDIDA_EVENT,
  CotizacionCreadaEvent,
  CotizacionRespondidaEvent,
} from '../../common/events/cotizacion.events';

/** Reacciona a los eventos de cotizaciones enviando los correos correspondientes. */
@Injectable()
export class CotizacionNotificacionesListener {
  private readonly logger = new Logger(CotizacionNotificacionesListener.name);

  constructor(private readonly emailService: EmailService) {}

  @OnEvent(COTIZACION_CREADA_EVENT, { async: true })
  async alCrear(event: CotizacionCreadaEvent): Promise<void> {
    try {
      // Correo al cliente confirmando que se recibió su consulta.
      await this.emailService.enviarConfirmacionCotizacion({
        email: event.email,
        nombre: event.nombre,
        nombrePaquete: event.nombrePaquete,
        nombreDestino: event.nombreDestino,
      });

      // Correo al equipo (ADMIN_NOTIFICATION_EMAIL) con la pregunta real.
      await this.emailService.notificarNuevaCotizacion({
        nombre: event.nombre,
        email: event.email,
        telefono: event.telefono,
        nombrePaquete: event.nombrePaquete,
        nombreDestino: event.nombreDestino,
        cantidadPersonas: event.cantidadPersonas,
        mensaje: event.mensaje,
      });
    } catch (error) {
      this.logger.error(
        `Fallo notificando la cotización ${event.cotizacionId}: ${(error as Error).message}`,
      );
    }
  }

  @OnEvent(COTIZACION_RESPONDIDA_EVENT, { async: true })
  async alResponder(event: CotizacionRespondidaEvent): Promise<void> {
    try {
      await this.emailService.notificarRespuestaCotizacion({
        email: event.email,
        nombre: event.nombre,
        respuesta: event.respuesta,
        nombrePaquete: event.nombrePaquete,
        nombreDestino: event.nombreDestino,
      });
    } catch (error) {
      this.logger.error(
        `Fallo notificando la respuesta de la cotización ${event.cotizacionId}: ${(error as Error).message}`,
      );
    }
  }
}
