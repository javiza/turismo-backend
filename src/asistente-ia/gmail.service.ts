import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, gmail_v1 } from 'googleapis';

export interface CorreoEntrante {
  id: string;
  threadId: string;
  remitente: string;
  asunto: string;
  cuerpo: string;
}

/**
 * Wrapper delgado sobre la API de Gmail.
 *
 * Auth: OAuth2 con un refresh token generado UNA VEZ manualmente (ver
 * README de este módulo). No usamos push notifications (Pub/Sub) porque
 * eso exige un proyecto de Google Cloud con facturación habilitada solo
 * para eso; para el volumen de correos de una agencia de turismo, hacer
 * polling cada 5 minutos con un cron es suficiente y mucho más simple de
 * operar. Si el volumen crece mucho a futuro, ahí sí se justifica migrar
 * a push notifications.
 *
 * Solo se opera sobre la etiqueta INBOX + UNREAD, y cada correo procesado
 * se marca como leído, así nunca se reprocesa ni se contesta dos veces.
 */
@Injectable()
export class GmailService implements OnModuleInit {
  private readonly logger = new Logger(GmailService.name);
  private gmail: gmail_v1.Gmail | null = null;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const clientId = this.config.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.config.get<string>('GOOGLE_CLIENT_SECRET');
    const refreshToken = this.config.get<string>('GOOGLE_REFRESH_TOKEN');

    if (!clientId || !clientSecret || !refreshToken) {
      this.logger.warn(
        'Gmail no configurado (faltan GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET/' +
          'GOOGLE_REFRESH_TOKEN). El asistente de correo queda desactivado.',
      );
      return;
    }

    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oAuth2Client.setCredentials({ refresh_token: refreshToken });

    this.gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    this.logger.log('Gmail API inicializada correctamente.');
  }

  /** true si hay credenciales configuradas y el servicio puede operar. */
  estaActivo(): boolean {
    return this.gmail !== null;
  }

  /** Lista los correos no leídos de la bandeja de entrada (excluye spam/promociones). */
  async listarNoLeidos(maxResultados = 15): Promise<CorreoEntrante[]> {
    if (!this.gmail) return [];

    try {
      const lista = await this.gmail.users.messages.list({
        userId: 'me',
        q: 'is:unread in:inbox -category:promotions -category:social',
        maxResults: maxResultados,
      });

      const ids = lista.data.messages ?? [];
      const correos: CorreoEntrante[] = [];

      for (const { id } of ids) {
        if (!id) continue;
        const correo = await this.obtenerCorreo(id);
        if (correo) correos.push(correo);
      }

      return correos;
    } catch (error) {
      this.logger.error(
        `Error listando correos no leídos: ${(error as Error).message}`,
      );
      return [];
    }
  }

  private async obtenerCorreo(id: string): Promise<CorreoEntrante | null> {
    if (!this.gmail) return null;

    try {
      const { data } = await this.gmail.users.messages.get({
        userId: 'me',
        id,
        format: 'full',
      });

      const headers = data.payload?.headers ?? [];
      const remitente =
        headers.find((h) => h.name === 'From')?.value ?? 'desconocido';
      const asunto = headers.find((h) => h.name === 'Subject')?.value ?? '';

      return {
        id,
        threadId: data.threadId ?? id,
        remitente,
        asunto,
        cuerpo: this.extraerTexto(data.payload),
      };
    } catch (error) {
      this.logger.error(
        `Error obteniendo correo ${id}: ${(error as Error).message}`,
      );
      return null;
    }
  }

  /** Extrae el texto plano del cuerpo, buscando recursivamente en las partes MIME. */
  private extraerTexto(payload?: gmail_v1.Schema$MessagePart): string {
    if (!payload) return '';

    if (payload.mimeType === 'text/plain' && payload.body?.data) {
      return Buffer.from(payload.body.data, 'base64').toString('utf-8');
    }

    for (const parte of payload.parts ?? []) {
      const texto = this.extraerTexto(parte);
      if (texto) return texto;
    }

    // Fallback: si solo viene HTML, se limpia lo básico para no mandarle
    // markup crudo a la IA.
    if (payload.mimeType === 'text/html' && payload.body?.data) {
      const html = Buffer.from(payload.body.data, 'base64').toString('utf-8');
      return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }

    return '';
  }

  /** Responde dentro del mismo hilo (References/In-Reply-To) para que el cliente lo vea como una conversación normal. */
  async responder(params: {
    messageId: string;
    threadId: string;
    para: string;
    asunto: string;
    cuerpo: string;
  }): Promise<void> {
    if (!this.gmail) {
      throw new Error('Gmail no está configurado.');
    }

    const asuntoRespuesta = params.asunto.toLowerCase().startsWith('re:')
      ? params.asunto
      : `Re: ${params.asunto}`;

    const rawMessage = [
      `To: ${params.para}`,
      `Subject: ${asuntoRespuesta}`,
      `In-Reply-To: ${params.messageId}`,
      `References: ${params.messageId}`,
      'Content-Type: text/plain; charset="UTF-8"',
      '',
      params.cuerpo,
    ].join('\n');

    const encoded = Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await this.gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encoded,
        threadId: params.threadId,
      },
    });
  }

  /** Marca el correo como leído (quita la etiqueta UNREAD). */
  async marcarComoLeido(messageId: string): Promise<void> {
    if (!this.gmail) return;

    await this.gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: { removeLabelIds: ['UNREAD'] },
    });
  }
}
