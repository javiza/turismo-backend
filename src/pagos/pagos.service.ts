import { randomUUID } from 'crypto';

import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  WebpayPlus,
  Options,
  Environment,
  IntegrationCommerceCodes,
  IntegrationApiKeys,
} from 'transbank-sdk';

import { PagoWebpay, EstadoPagoWebpay } from './entities/pago-webpay.entity';
import { Reserva, EstadoReserva } from '../reservas/entities/reserva.entity';
import { MetodoPago } from '../finanzas/entities/movimiento-financiero.entity';
import { ConfiguracionService } from '../configuracion/configuracion.service';

interface ResultadoRetornoWebpay {
  reservaId: number;
  aprobado: boolean;
  anulado: boolean;
}

/**
 * Pago con tarjeta vía Transbank Webpay Plus.
 *
 * A diferencia de EmailService/WhatsappService, acá NO hay "modo
 * simulado" silencioso: si no se configuran TRANSBANK_COMMERCE_CODE y
 * TRANSBANK_API_KEY, el servicio usa las credenciales de integración
 * (ambiente de pruebas) que Transbank publica para TODOS sus
 * integradores — así el flujo completo funciona de inmediato en
 * desarrollo, con tarjetas de prueba, sin que nadie tenga que pedir
 * acceso a Transbank solo para programar. En producción SIEMPRE hay que
 * configurar las credenciales reales (ver README) o los pagos reales no
 * van a funcionar (el ambiente de integración no mueve dinero real).
 *
 * Referencia: https://www.transbankdevelopers.cl/documentacion/webpay
 */
@Injectable()
export class PagosService {
  private readonly logger = new Logger(PagosService.name);
  private readonly backendUrl: string;
  private readonly frontendUrl: string;

  constructor(
    private readonly config: ConfigService,
    private readonly configuracion: ConfiguracionService,
    @InjectRepository(PagoWebpay)
    private readonly pagoRepository: Repository<PagoWebpay>,
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
  ) {
    this.backendUrl = (
      this.config.get<string>('BACKEND_PUBLIC_URL') ??
      `http://localhost:${this.config.get<string>('PORT') ?? '3000'}`
    ).replace(/\/+$/, '');
    this.frontendUrl = (
      this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:5173'
    ).replace(/\/+$/, '');
  }

  /**
   * Arma la transacción de Webpay leyendo SIEMPRE la config vigente
   * (panel admin primero, .env como respaldo) — así activar modo
   * producción con credenciales reales desde el panel aplica de
   * inmediato, sin redeploy.
   */
  private async getTransaction(): Promise<InstanceType<typeof WebpayPlus.Transaction>> {
    const cfg = await this.configuracion.obtenerTransbank();
    const esProduccion = cfg.environment === 'production';

    if (esProduccion) {
      if (!cfg.commerceCode || !cfg.apiKey) {
        throw new Error(
          'Transbank en modo producción requiere código de comercio y API ' +
            'key reales (configúralos en el panel admin → Configuración → ' +
            'Transbank, con las credenciales que te entrega Transbank tras ' +
            'la afiliación/certificación de tu comercio).',
        );
      }
      return new WebpayPlus.Transaction(
        new Options(cfg.commerceCode, cfg.apiKey, Environment.Production),
      );
    }

    if (cfg.commerceCode && cfg.apiKey) {
      return new WebpayPlus.Transaction(
        new Options(cfg.commerceCode, cfg.apiKey, Environment.Integration),
      );
    }

    this.logger.warn(
      'Webpay Plus en modo INTEGRACIÓN (pruebas, credenciales públicas) — ' +
        'no se mueve dinero real. Configura credenciales reales y ambiente ' +
        '"production" desde el panel admin → Configuración → Transbank ' +
        'antes de salir a producción.',
    );
    return WebpayPlus.Transaction.buildForIntegration(
      IntegrationCommerceCodes.WEBPAY_PLUS,
      IntegrationApiKeys.WEBPAY,
    );
  }

  /**
   * Inicia un pago para una reserva PENDIENTE y devuelve la URL de Webpay
   * más el token que el frontend debe enviar en un form POST (así lo
   * exige Transbank; no es un simple redirect por GET).
   */
  async iniciar(reservaId: number): Promise<{ url: string; token: string }> {
    const reserva = await this.reservaRepository.findOne({
      where: { id: reservaId },
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }
    if (reserva.estado === EstadoReserva.CANCELADA) {
      throw new BadRequestException(
        'Esta reserva está cancelada, no se puede pagar',
      );
    }
    if (reserva.metodoPago === MetodoPago.WEBPAY) {
      throw new ConflictException('Esta reserva ya fue pagada con Webpay');
    }
    if (!reserva.montoTotal || reserva.montoTotal <= 0) {
      throw new BadRequestException(
        'La reserva no tiene un monto válido para cobrar',
      );
    }

    // Máx. 26 caracteres — el id de la reserva alcanza sobrado para no
    // repetirse dentro del mismo timestamp, y el timestamp permite
    // reintentar un pago (buy_order distinto) si el anterior quedó
    // RECHAZADO o el cliente cerró la pestaña de Webpay a mitad de camino.
    const buyOrder = `R${reservaId}-${Date.now()}`.slice(0, 26);
    const sessionId = randomUUID();
    // CLP no tiene decimales: Webpay exige un entero.
    const monto = Math.round(reserva.montoTotal);
    const returnUrl = `${this.backendUrl}/api/v1/pagos/webpay/retorno`;

    const transaction = await this.getTransaction();
    const respuesta = (await transaction.create(
      buyOrder,
      sessionId,
      monto,
      returnUrl,
    )) as { token: string; url: string };

    await this.pagoRepository.save(
      this.pagoRepository.create({
        reservaId,
        buyOrder,
        sessionId,
        token: respuesta.token,
        monto,
        estado: EstadoPagoWebpay.INICIADO,
        respuestaCruda: { create: respuesta },
      }),
    );

    return { url: respuesta.url, token: respuesta.token };
  }

  /**
   * Confirma (commit) un pago ya autorizado por el titular de la tarjeta
   * en la página de Webpay. Lo llama PagosController.retorno() cuando
   * Transbank redirige de vuelta con token_ws.
   */
  async confirmar(tokenWs: string): Promise<ResultadoRetornoWebpay> {
    const pago = await this.pagoRepository.findOne({
      where: { token: tokenWs },
    });

    if (!pago) {
      throw new NotFoundException('Transacción de pago no encontrada');
    }

    // Si por lo que sea Transbank vuelve a pegarle a esta URL para un
    // pago que ya procesamos (doble callback, F5 del usuario en la
    // página de retorno, etc.), no hacemos commit dos veces: Transbank
    // devuelve error si se intenta.
    if (pago.estado !== EstadoPagoWebpay.INICIADO) {
      return {
        reservaId: pago.reservaId,
        aprobado: pago.estado === EstadoPagoWebpay.AUTORIZADO,
        anulado: pago.estado === EstadoPagoWebpay.ANULADO,
      };
    }

    const transaction = await this.getTransaction();
    const respuesta = (await transaction.commit(tokenWs)) as {
      status: string;
      response_code: number;
      authorization_code?: string;
      payment_type_code?: string;
      installments_number?: number;
      transaction_date?: string;
      card_detail?: { card_number?: string };
    };

    const aprobado =
      respuesta.status === 'AUTHORIZED' && respuesta.response_code === 0;

    pago.estado = aprobado
      ? EstadoPagoWebpay.AUTORIZADO
      : EstadoPagoWebpay.RECHAZADO;
    pago.codigoAutorizacion = respuesta.authorization_code ?? null;
    pago.codigoRespuesta = respuesta.response_code;
    pago.tipoPago = respuesta.payment_type_code ?? null;
    pago.cuotas = respuesta.installments_number ?? null;
    pago.ultimosDigitosTarjeta = respuesta.card_detail?.card_number
      ? respuesta.card_detail.card_number.slice(-4)
      : null;
    pago.fechaTransaccion = respuesta.transaction_date
      ? new Date(respuesta.transaction_date)
      : null;
    pago.respuestaCruda = {
      ...(pago.respuestaCruda ?? {}),
      commit: respuesta,
    };
    await this.pagoRepository.save(pago);

    if (aprobado) {
      await this.reservaRepository.update(pago.reservaId, {
        estado: EstadoReserva.CONFIRMADA,
        metodoPago: MetodoPago.WEBPAY,
        pagadoEn: new Date(),
      });
    } else {
      this.logger.warn(
        `Pago Webpay rechazado para reserva ${pago.reservaId} ` +
          `(response_code=${respuesta.response_code})`,
      );
    }

    return { reservaId: pago.reservaId, aprobado, anulado: false };
  }

  /**
   * El cliente puede abortar el pago desde la propia página de Webpay
   * ("Anular compra") antes de que el banco responda. En ese caso
   * Transbank redirige por GET con TBK_TOKEN/TBK_ORDEN_COMPRA en vez de
   * POST con token_ws — nunca hay que llamar a commit() con eso, solo
   * dejar constancia de que se anuló.
   */
  async marcarAnulado(buyOrder: string): Promise<ResultadoRetornoWebpay> {
    const pago = await this.pagoRepository.findOne({ where: { buyOrder } });

    if (!pago) {
      throw new NotFoundException('Transacción de pago no encontrada');
    }

    if (pago.estado === EstadoPagoWebpay.INICIADO) {
      pago.estado = EstadoPagoWebpay.ANULADO;
      await this.pagoRepository.save(pago);
    }

    return { reservaId: pago.reservaId, aprobado: false, anulado: true };
  }
}
