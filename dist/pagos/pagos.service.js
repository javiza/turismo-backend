"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PagosService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagosService = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transbank_sdk_1 = require("transbank-sdk");
const pago_webpay_entity_1 = require("./entities/pago-webpay.entity");
const reserva_entity_1 = require("../reservas/entities/reserva.entity");
const movimiento_financiero_entity_1 = require("../finanzas/entities/movimiento-financiero.entity");
let PagosService = PagosService_1 = class PagosService {
    config;
    pagoRepository;
    reservaRepository;
    logger = new common_1.Logger(PagosService_1.name);
    transaction;
    esProduccion;
    backendUrl;
    frontendUrl;
    constructor(config, pagoRepository, reservaRepository) {
        this.config = config;
        this.pagoRepository = pagoRepository;
        this.reservaRepository = reservaRepository;
        const commerceCode = this.config.get('TRANSBANK_COMMERCE_CODE');
        const apiKey = this.config.get('TRANSBANK_API_KEY');
        this.esProduccion =
            this.config.get('TRANSBANK_ENVIRONMENT') === 'production';
        this.backendUrl = (this.config.get('BACKEND_PUBLIC_URL') ??
            `http://localhost:${this.config.get('PORT') ?? '3000'}`).replace(/\/+$/, '');
        this.frontendUrl = (this.config.get('FRONTEND_URL') ?? 'http://localhost:5173').replace(/\/+$/, '');
        if (this.esProduccion) {
            if (!commerceCode || !apiKey) {
                throw new Error('TRANSBANK_ENVIRONMENT=production requiere TRANSBANK_COMMERCE_CODE ' +
                    'y TRANSBANK_API_KEY (credenciales reales entregadas por Transbank ' +
                    'tras el proceso de afiliación/certificación de tu comercio).');
            }
            this.transaction = new transbank_sdk_1.WebpayPlus.Transaction(new transbank_sdk_1.Options(commerceCode, apiKey, transbank_sdk_1.Environment.Production));
            this.logger.log('Webpay Plus configurado en modo PRODUCCIÓN.');
        }
        else {
            this.transaction =
                commerceCode && apiKey
                    ? new transbank_sdk_1.WebpayPlus.Transaction(new transbank_sdk_1.Options(commerceCode, apiKey, transbank_sdk_1.Environment.Integration))
                    : transbank_sdk_1.WebpayPlus.Transaction.buildForIntegration(transbank_sdk_1.IntegrationCommerceCodes.WEBPAY_PLUS, transbank_sdk_1.IntegrationApiKeys.WEBPAY);
            this.logger.warn('Webpay Plus en modo INTEGRACIÓN (pruebas) — no se mueve dinero ' +
                'real. Configura TRANSBANK_ENVIRONMENT=production con credenciales ' +
                'reales antes de salir a producción.');
        }
    }
    async iniciar(reservaId) {
        const reserva = await this.reservaRepository.findOne({
            where: { id: reservaId },
        });
        if (!reserva) {
            throw new common_1.NotFoundException('Reserva no encontrada');
        }
        if (reserva.estado === reserva_entity_1.EstadoReserva.CANCELADA) {
            throw new common_1.BadRequestException('Esta reserva está cancelada, no se puede pagar');
        }
        if (reserva.metodoPago === movimiento_financiero_entity_1.MetodoPago.WEBPAY) {
            throw new common_1.ConflictException('Esta reserva ya fue pagada con Webpay');
        }
        if (!reserva.montoTotal || reserva.montoTotal <= 0) {
            throw new common_1.BadRequestException('La reserva no tiene un monto válido para cobrar');
        }
        const buyOrder = `R${reservaId}-${Date.now()}`.slice(0, 26);
        const sessionId = (0, crypto_1.randomUUID)();
        const monto = Math.round(reserva.montoTotal);
        const returnUrl = `${this.backendUrl}/api/v1/pagos/webpay/retorno`;
        const respuesta = (await this.transaction.create(buyOrder, sessionId, monto, returnUrl));
        await this.pagoRepository.save(this.pagoRepository.create({
            reservaId,
            buyOrder,
            sessionId,
            token: respuesta.token,
            monto,
            estado: pago_webpay_entity_1.EstadoPagoWebpay.INICIADO,
            respuestaCruda: { create: respuesta },
        }));
        return { url: respuesta.url, token: respuesta.token };
    }
    async confirmar(tokenWs) {
        const pago = await this.pagoRepository.findOne({
            where: { token: tokenWs },
        });
        if (!pago) {
            throw new common_1.NotFoundException('Transacción de pago no encontrada');
        }
        if (pago.estado !== pago_webpay_entity_1.EstadoPagoWebpay.INICIADO) {
            return {
                reservaId: pago.reservaId,
                aprobado: pago.estado === pago_webpay_entity_1.EstadoPagoWebpay.AUTORIZADO,
                anulado: pago.estado === pago_webpay_entity_1.EstadoPagoWebpay.ANULADO,
            };
        }
        const respuesta = (await this.transaction.commit(tokenWs));
        const aprobado = respuesta.status === 'AUTHORIZED' && respuesta.response_code === 0;
        pago.estado = aprobado
            ? pago_webpay_entity_1.EstadoPagoWebpay.AUTORIZADO
            : pago_webpay_entity_1.EstadoPagoWebpay.RECHAZADO;
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
                estado: reserva_entity_1.EstadoReserva.CONFIRMADA,
                metodoPago: movimiento_financiero_entity_1.MetodoPago.WEBPAY,
                pagadoEn: new Date(),
            });
        }
        else {
            this.logger.warn(`Pago Webpay rechazado para reserva ${pago.reservaId} ` +
                `(response_code=${respuesta.response_code})`);
        }
        return { reservaId: pago.reservaId, aprobado, anulado: false };
    }
    async marcarAnulado(buyOrder) {
        const pago = await this.pagoRepository.findOne({ where: { buyOrder } });
        if (!pago) {
            throw new common_1.NotFoundException('Transacción de pago no encontrada');
        }
        if (pago.estado === pago_webpay_entity_1.EstadoPagoWebpay.INICIADO) {
            pago.estado = pago_webpay_entity_1.EstadoPagoWebpay.ANULADO;
            await this.pagoRepository.save(pago);
        }
        return { reservaId: pago.reservaId, aprobado: false, anulado: true };
    }
};
exports.PagosService = PagosService;
exports.PagosService = PagosService = PagosService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(pago_webpay_entity_1.PagoWebpay)),
    __param(2, (0, typeorm_1.InjectRepository)(reserva_entity_1.Reserva)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PagosService);
//# sourceMappingURL=pagos.service.js.map