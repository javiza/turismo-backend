"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let AllExceptionsFilter = class AllExceptionsFilter {
    logger = new common_1.Logger('ExceptionsFilter');
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const { statusCode, message } = this.resolver(exception);
        if (statusCode >= 500) {
            this.logger.error(`${request.method} ${request.url} -> ${statusCode}: ${exception?.message ?? exception}`, exception?.stack);
        }
        else if (exception instanceof typeorm_1.QueryFailedError) {
            this.logger.warn(`${request.method} ${request.url} -> ${statusCode}: ${message} | detalle: ${exception.message}`);
        }
        else {
            this.logger.warn(`${request.method} ${request.url} -> ${statusCode}: ${message}`);
        }
        response.status(statusCode).json({
            statusCode,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
    resolver(exception) {
        if (exception instanceof common_1.HttpException) {
            const respuesta = exception.getResponse();
            const message = typeof respuesta === 'string'
                ? respuesta
                : (respuesta.message ??
                    exception.message);
            return { statusCode: exception.getStatus(), message };
        }
        if (exception instanceof typeorm_1.EntityNotFoundError) {
            return { statusCode: common_1.HttpStatus.NOT_FOUND, message: 'Recurso no encontrado' };
        }
        if (exception instanceof typeorm_1.QueryFailedError) {
            const codigoPg = exception
                .code;
            if (codigoPg === '23505') {
                return {
                    statusCode: common_1.HttpStatus.CONFLICT,
                    message: 'Ya existe un registro con ese valor único',
                };
            }
            if (codigoPg === '23503') {
                return {
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: 'La operación referencia un registro que no existe',
                };
            }
            if (codigoPg === '23502') {
                return {
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Falta un dato obligatorio en la solicitud',
                };
            }
            return {
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Error interno al procesar la solicitud',
            };
        }
        return {
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error interno del servidor',
        };
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map