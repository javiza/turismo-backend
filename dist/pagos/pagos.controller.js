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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagosController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const pagos_service_1 = require("./pagos.service");
let PagosController = class PagosController {
    pagosService;
    config;
    frontendUrl;
    constructor(pagosService, config) {
        this.pagosService = pagosService;
        this.config = config;
        this.frontendUrl = (this.config.get('FRONTEND_URL') ?? 'http://localhost:5173').replace(/\/+$/, '');
    }
    iniciar(reservaId) {
        return this.pagosService.iniciar(reservaId);
    }
    async retornoPost(tokenWs, tbkToken, tbkOrdenCompra, res) {
        return this.procesarRetorno(tokenWs, tbkOrdenCompra, tbkToken, res);
    }
    async retornoGet(tokenWs, tbkToken, tbkOrdenCompra, res) {
        return this.procesarRetorno(tokenWs, tbkOrdenCompra, tbkToken, res);
    }
    async procesarRetorno(tokenWs, tbkOrdenCompra, tbkToken, res) {
        try {
            if (tokenWs) {
                const resultado = await this.pagosService.confirmar(tokenWs);
                return res.redirect(this.urlResultado(resultado.reservaId, resultado.aprobado ? 'exitoso' : 'rechazado'));
            }
            if (tbkToken && tbkOrdenCompra) {
                const resultado = await this.pagosService.marcarAnulado(tbkOrdenCompra);
                return res.redirect(this.urlResultado(resultado.reservaId, 'anulado'));
            }
            return res.redirect(`${this.frontendUrl}/pago/resultado?estado=error`);
        }
        catch {
            return res.redirect(`${this.frontendUrl}/pago/resultado?estado=error`);
        }
    }
    urlResultado(reservaId, estado) {
        return `${this.frontendUrl}/pago/resultado?estado=${estado}&reserva=${reservaId}`;
    }
};
exports.PagosController = PagosController;
__decorate([
    (0, common_1.Post)(':reservaId/iniciar'),
    __param(0, (0, common_1.Param)('reservaId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PagosController.prototype, "iniciar", null);
__decorate([
    (0, common_1.Post)('retorno'),
    __param(0, (0, common_1.Body)('token_ws')),
    __param(1, (0, common_1.Body)('TBK_TOKEN')),
    __param(2, (0, common_1.Body)('TBK_ORDEN_COMPRA')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PagosController.prototype, "retornoPost", null);
__decorate([
    (0, common_1.Get)('retorno'),
    __param(0, (0, common_1.Query)('token_ws')),
    __param(1, (0, common_1.Query)('TBK_TOKEN')),
    __param(2, (0, common_1.Query)('TBK_ORDEN_COMPRA')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PagosController.prototype, "retornoGet", null);
exports.PagosController = PagosController = __decorate([
    (0, common_1.Controller)('pagos/webpay'),
    __metadata("design:paramtypes", [pagos_service_1.PagosService,
        config_1.ConfigService])
], PagosController);
//# sourceMappingURL=pagos.controller.js.map