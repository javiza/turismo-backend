import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

/**
 * Antes de este filtro, un error no controlado (ej. QueryFailedError como
 * el que causó el bug original de login) llegaba al cliente con el manejo
 * genérico de Nest: un 500 sin distinguir el tipo de error, y sin un
 * formato de respuesta consistente con el resto de la API.
 *
 * Este filtro:
 *   1. Traduce errores comunes de TypeORM a códigos HTTP apropiados
 *      (violación de unique -> 409, columna/tabla inexistente -> 500 pero
 *      con mensaje genérico al cliente, nunca el detalle del driver).
 *   2. Nunca filtra detalles internos (query SQL, stack trace) al cliente,
 *      solo al log del servidor.
 *   3. Devuelve siempre la misma forma de respuesta: statusCode, message,
 *      path, timestamp.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionsFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, message } = this.resolver(exception);

    if (statusCode >= 500) {
      this.logger.error(
        `${request.method} ${request.url} -> ${statusCode}: ${
          (exception as Error)?.message ?? exception
        }`,
        (exception as Error)?.stack,
      );
    } else if (exception instanceof QueryFailedError) {
      // Aunque el cliente reciba un mensaje genérico (400/409), el detalle
      // real del driver (ej. qué columna violó el NOT NULL) SIEMPRE queda
      // en este log, para poder depurar sin tener que bajar el status a
      // 500 a propósito.
      this.logger.warn(
        `${request.method} ${request.url} -> ${statusCode}: ${message} | detalle: ${exception.message}`,
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} -> ${statusCode}: ${message}`,
      );
    }

    response.status(statusCode).json({
      statusCode,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private resolver(exception: unknown): {
    statusCode: number;
    message: string | string[];
  } {
    if (exception instanceof HttpException) {
      const respuesta = exception.getResponse();
      const message =
        typeof respuesta === 'string'
          ? respuesta
          : ((respuesta as { message?: string | string[] }).message ??
            exception.message);

      return { statusCode: exception.getStatus(), message };
    }

    if (exception instanceof EntityNotFoundError) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'Recurso no encontrado' };
    }

    if (exception instanceof QueryFailedError) {
      // Código de Postgres: 23505 = unique_violation, 23503 = foreign_key_violation.
      const codigoPg = (exception as QueryFailedError & { code?: string })
        .code;

      if (codigoPg === '23505') {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'Ya existe un registro con ese valor único',
        };
      }

      if (codigoPg === '23503') {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'La operación referencia un registro que no existe',
        };
      }

      if (codigoPg === '23502') {
        // not_null_violation: falta un campo requerido que no llegó a
        // pasar por el DTO (ej. llamada directa a la API sin pasar por
        // el ValidationPipe). Nunca se expone qué columna fue.
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Falta un dato obligatorio en la solicitud',
        };
      }

      // Cualquier otro error de base de datos (columna inexistente, tipo
      // inválido, etc.): nunca se le muestra el detalle del driver al
      // cliente, solo queda en el log del servidor (arriba).
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error interno al procesar la solicitud',
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error interno del servidor',
    };
  }
}
