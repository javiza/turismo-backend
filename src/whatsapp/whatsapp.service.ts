import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { WHATSAPP_QUEUE, WhatsappJobData } from './whatsapp.queue';
import { ConfiguracionService } from '../configuracion/configuracion.service';

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

  constructor(
    private readonly configuracion: ConfiguracionService,
    @InjectQueue(WHATSAPP_QUEUE) private readonly queue: Queue<WhatsappJobData>,
  ) {}

  /** Lee la config vigente (panel admin primero, .env como respaldo) en cada envío. */
  private async getConfig(): Promise<{
    apiUrl: string | null;
    token: string | null;
    adminNumber: string | null;
  }> {
    const cfg = await this.configuracion.obtenerWhatsapp();

    if (!cfg.token || !cfg.phoneNumberId || !cfg.adminNumber) {
      this.logger.warn(
        'WhatsApp Business API no configurada (falta token/phoneNumberId/' +
          'adminNumber, ni en el panel admin ni en .env). Los mensajes se ' +
          'registrarán en el log en vez de enviarse.',
      );
      return { apiUrl: null, token: null, adminNumber: cfg.adminNumber || null };
    }

    return {
      apiUrl: `https://graph.facebook.com/${cfg.apiVersion}/${cfg.phoneNumberId}/messages`,
      token: cfg.token,
      adminNumber: cfg.adminNumber,
    };
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
    const { apiUrl, token } = await this.getConfig();

    if (!apiUrl || !token) {
      this.logger.log(`[WHATSAPP SIMULADO] para=${to} texto="${texto}"`);
      return;
    }

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
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
    const { adminNumber } = await this.getConfig();

    if (!adminNumber) {
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

    await this.enviarTexto(adminNumber, texto);
  }
}
