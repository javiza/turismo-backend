import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { WHATSAPP_QUEUE, WhatsappJobData } from './whatsapp.queue';

/**
 * Envío de mensajes de WhatsApp vía la API oficial de WhatsApp Business
 * Cloud (Meta Graph API). El envío real ocurre en segundo plano vía BullMQ
 * (ver whatsapp.processor.ts), igual que EmailService: si las credenciales
 * no están configuradas, el worker queda en "modo simulado" (solo loguea)
 * para no romper el flujo de negocio (guardar el proveedor nuevo, etc.) en
 * un ambiente sin credenciales de Meta.
 *
 * Requiere en .env:
 * - WHATSAPP_TOKEN: token de acceso permanente de la app de Meta.
 * - WHATSAPP_PHONE_NUMBER_ID: ID del número emisor (el de la agencia),
 *   NO el número en sí — lo entrega el panel de Meta for Developers.
 * - WHATSAPP_ADMIN_NUMBER: número del admin que recibe el aviso, en
 *   formato E.164 sin "+" (ej. 56912345678).
 *
 * Referencia: https://developers.facebook.com/docs/whatsapp/cloud-api
 */
@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly apiUrl: string | null;
  private readonly token: string | null;
  private readonly adminNumber: string | null;

  constructor(
    private readonly config: ConfigService,
    @InjectQueue(WHATSAPP_QUEUE) private readonly queue: Queue<WhatsappJobData>,
  ) {
    const token = this.config.get<string>('WHATSAPP_TOKEN');
    const phoneNumberId = this.config.get<string>('WHATSAPP_PHONE_NUMBER_ID');
    const adminNumber = this.config.get<string>('WHATSAPP_ADMIN_NUMBER');
    const apiVersion =
      this.config.get<string>('WHATSAPP_API_VERSION') ?? 'v20.0';

    if (!token || !phoneNumberId || !adminNumber) {
      this.logger.warn(
        'WhatsApp Business API no configurada (faltan WHATSAPP_TOKEN/' +
          'WHATSAPP_PHONE_NUMBER_ID/WHATSAPP_ADMIN_NUMBER). Los mensajes ' +
          'se registrarán en el log en vez de enviarse.',
      );
      this.apiUrl = null;
      this.token = null;
      this.adminNumber = null;
      return;
    }

    this.apiUrl = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;
    this.token = token;
    this.adminNumber = adminNumber;
  }

  /** Encola el mensaje para envío en segundo plano. */
  private async enviarTexto(to: string, texto: string): Promise<void> {
    await this.queue.add(
      'send',
      { to, texto },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5_000 },
        removeOnComplete: { age: 3600 },
        removeOnFail: { age: 86_400 },
      },
    );
  }

  /**
   * Envío real vía Graph API. Solo lo debe llamar WhatsappProcessor (el
   * worker de la cola 'whatsapp') — nunca el resto del código de negocio.
   */
  async enviarTextoImmediate(to: string, texto: string): Promise<void> {
    if (!this.apiUrl || !this.token) {
      this.logger.log(`[WHATSAPP SIMULADO] para=${to} texto="${texto}"`);
      return;
    }

    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: texto },
      }),
    });

    if (!res.ok) {
      const detalle = await res.text();
      throw new Error(`HTTP ${res.status}: ${detalle}`);
    }
  }

  /** Aviso al admin cuando un proveedor nuevo deja sus datos desde el sitio. */
  async notificarProveedorNuevo(params: {
    nombreNegocio: string;
    rubro?: string;
    nombreContacto: string;
    telefono: string;
    correo: string;
  }): Promise<void> {
    if (!this.adminNumber) {
      this.logger.log(
        `[WHATSAPP SIMULADO] Proveedor nuevo: ${params.nombreNegocio}`,
      );
      return;
    }

    const texto =
      `*Proveedor nuevo*\n` +
      `Negocio: ${params.nombreNegocio}\n` +
      (params.rubro ? `Rubro: ${params.rubro}\n` : '') +
      `Contacto: ${params.nombreContacto}\n` +
      `Teléfono: ${params.telefono}\n` +
      `Correo: ${params.correo}\n` +
      `Revisa el detalle completo en el panel admin.`;

    await this.enviarTexto(this.adminNumber, texto);
  }
}
