import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

/**
 * Envío de correos transaccionales (confirmación de reserva, confirmación
 * de cotización, aviso de nuevo mensaje de contacto al admin).
 *
 * Diseño a propósito simple: SMTP vía nodemailer, sin colas ni proveedores
 * externos. Es la solución correcta para volumen bajo/medio de una agencia
 * de turismo; n8n o una cola (BullMQ) solo se justifican si el volumen de
 * envíos crece mucho o si se necesita reintentos/orquestación compleja.
 *
 * Si SMTP_HOST no está configurado, el servicio queda "en modo simulado":
 * loguea el correo en vez de enviarlo, para no romper el flujo de reservas/
 * cotizaciones en un ambiente de desarrollo sin credenciales SMTP reales.
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter | null;
  private readonly fromAddress: string;
  private readonly adminAddress: string;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST');
    const port = Number(this.config.get<string>('SMTP_PORT') ?? 587);
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASSWORD');

    this.fromAddress =
      this.config.get<string>('SMTP_FROM') ?? 'no-reply@agencia-viajes.local';
    this.adminAddress =
      this.config.get<string>('ADMIN_NOTIFICATION_EMAIL') ?? this.fromAddress;

    if (!host || !user || !pass) {
      this.logger.warn(
        'SMTP no configurado (faltan SMTP_HOST/SMTP_USER/SMTP_PASSWORD). ' +
          'Los correos se registrarán en el log en vez de enviarse.',
      );
      this.transporter = null;
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    if (!this.transporter) {
      this.logger.log(`[EMAIL SIMULADO] para=${to} asunto="${subject}"`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject,
        html,
      });
    } catch (error) {
      // Un correo fallido NUNCA debe tumbar la operación de negocio
      // (crear la reserva/cotización ya se hizo y quedó guardada). Solo
      // se registra el error para que el admin lo revise manualmente.
      this.logger.error(
        `No se pudo enviar correo a ${to}: ${(error as Error).message}`,
      );
    }
  }

  async enviarConfirmacionReserva(params: {
    email: string;
    nombreCliente: string;
    nombrePaquete: string;
    cantidadPersonas: number;
    montoTotal?: number;
    fechaInicio: string;
    fechaFin: string;
  }): Promise<void> {
    if (!params.email) return;

    const monto =
      params.montoTotal !== undefined
        ? new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
          }).format(params.montoTotal)
        : 'a confirmar';

    await this.send(
      params.email,
      `Reserva recibida: ${params.nombrePaquete}`,
      `<h2>¡Gracias por tu reserva, ${params.nombreCliente}!</h2>
       <p>Recibimos tu solicitud para <strong>${params.nombrePaquete}</strong>
       (${params.fechaInicio} al ${params.fechaFin}) para
       ${params.cantidadPersonas} persona(s).</p>
       <p>Monto total estimado: <strong>${monto}</strong></p>
       <p>Tu reserva está <strong>pendiente de confirmación</strong> por
       nuestro equipo. Te contactaremos a la brevedad.</p>`,
    );
  }

  async enviarConfirmacionCotizacion(params: {
    email: string;
    nombre: string;
    nombrePaquete?: string;
    nombreDestino?: string;
  }): Promise<void> {
    if (!params.email) return;

    const sobreQue = params.nombrePaquete
      ? ` para <strong>${params.nombrePaquete}</strong>`
      : params.nombreDestino
        ? ` sobre <strong>${params.nombreDestino}</strong>`
        : '';

    await this.send(
      params.email,
      'Recibimos tu solicitud de cotización',
      `<h2>Hola ${params.nombre},</h2>
       <p>Recibimos tu solicitud de cotización${sobreQue}.</p>
       <p>Nuestro equipo la revisará y te contactará pronto con los
       detalles.</p>`,
    );
  }

  /** El asistente IA de correo decidió NO responder solo (fuera de catálogo, reserva existente, reclamo, etc.) y necesita revisión humana. */
  async notificarConsultaEscalada(params: {
    remitente: string;
    asunto: string;
    motivo: string;
  }): Promise<void> {
    await this.send(
      this.adminAddress,
      `[Requiere respuesta] ${params.asunto || 'Consulta de cliente'}`,
      `<h3>El asistente IA no pudo responder este correo automáticamente</h3>
       <p><strong>De:</strong> ${params.remitente}</p>
       <p><strong>Motivo de escalamiento:</strong> ${params.motivo}</p>
       <p>Revisa el correo directamente en Gmail (quedó marcado como no leído).</p>`,
    );
  }

  async notificarNuevoMensaje(params: {
    nombre: string;
    correo: string;
    asunto?: string;
    mensaje: string;
  }): Promise<void> {
    await this.send(
      this.adminAddress,
      `Nuevo mensaje de contacto${params.asunto ? `: ${params.asunto}` : ''}`,
      `<h3>Nuevo mensaje desde el formulario de contacto</h3>
       <p><strong>Nombre:</strong> ${params.nombre}</p>
       <p><strong>Correo:</strong> ${params.correo}</p>
       <p><strong>Mensaje:</strong></p>
       <p>${params.mensaje}</p>`,
    );
  }

  /**
   * Aviso al admin (a ADMIN_NOTIFICATION_EMAIL, la casilla Gmail de la
   * agencia) cada vez que un visitante o cliente usa el botón "Consultar"
   * sobre un paquete. A diferencia de enviarConfirmacionCotizacion (que
   * va al cliente), este correo es el que de verdad llega a Gmail con
   * la pregunta para que el equipo la vea y responda.
   */
  async notificarNuevaCotizacion(params: {
    nombre: string;
    email: string;
    telefono?: string;
    nombrePaquete?: string;
    nombreDestino?: string;
    cantidadPersonas?: number;
    mensaje?: string;
  }): Promise<void> {
    const asuntoRef = params.nombrePaquete || params.nombreDestino;

    await this.send(
      this.adminAddress,
      `Nueva consulta${asuntoRef ? `: ${asuntoRef}` : ''}`,
      `<h3>Nueva consulta recibida desde el sitio</h3>
       <p><strong>Nombre:</strong> ${params.nombre}</p>
       <p><strong>Correo:</strong> ${params.email}</p>
       ${params.telefono ? `<p><strong>Teléfono:</strong> ${params.telefono}</p>` : ''}
       ${params.nombrePaquete ? `<p><strong>Paquete:</strong> ${params.nombrePaquete}</p>` : ''}
       ${params.nombreDestino ? `<p><strong>Destino:</strong> ${params.nombreDestino}</p>` : ''}
       ${params.cantidadPersonas ? `<p><strong>Personas:</strong> ${params.cantidadPersonas}</p>` : ''}
       <p><strong>Pregunta:</strong></p>
       <p>${params.mensaje || '(sin mensaje)'}</p>`,
    );
  }

  /** Aviso al cliente cuando el admin responde su consulta/cotización desde el panel. */
  async notificarRespuestaCotizacion(params: {
    email: string;
    nombre: string;
    respuesta: string;
    nombrePaquete?: string;
    nombreDestino?: string;
  }): Promise<void> {
    if (!params.email) return;

    const sobreQue = params.nombrePaquete
      ? ` sobre <strong>${params.nombrePaquete}</strong>`
      : params.nombreDestino
        ? ` sobre <strong>${params.nombreDestino}</strong>`
        : '';

    await this.send(
      params.email,
      'Respondimos tu consulta',
      `<h2>Hola ${params.nombre},</h2>
       <p>Tenemos una respuesta para tu consulta${sobreQue}:</p>
       <blockquote style="border-left:3px solid #e07444;margin:0;padding:8px 16px;color:#333;">
         ${params.respuesta}
       </blockquote>
       <p>Puedes ver el detalle e historial completo iniciando sesión en tu cuenta.</p>`,
    );
  }
}
