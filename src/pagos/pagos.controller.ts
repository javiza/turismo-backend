import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Body,
  Query,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

import { PagosService } from './pagos.service';

@Controller('pagos/webpay')
export class PagosController {
  private readonly frontendUrl: string;

  constructor(
    private readonly pagosService: PagosService,
    private readonly config: ConfigService,
  ) {
    this.frontendUrl = (
      this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:5173'
    ).replace(/\/+$/, '');
  }

  // Público a propósito: el checkout de reservas admite "invitado" (sin
  // cuenta), así que pagar tampoco puede exigir sesión. reservaId es un
  // correlativo público (igual que hoy en /reservas/:id para el admin);
  // no hay dato sensible que proteger acá, el peor caso es que alguien
  // pague la reserva de otra persona, lo cual no es un problema real.
  @Post(':reservaId/iniciar')
  iniciar(@Param('reservaId', ParseIntPipe) reservaId: number) {
    return this.pagosService.iniciar(reservaId);
  }

  // URL de retorno configurada como returnUrl al crear la transacción.
  // Transbank llega acá de dos formas MUY distintas y hay que soportar
  // ambas (ver detalle en cada rama):
  @Post('retorno')
  async retornoPost(
    @Body('token_ws') tokenWs: string | undefined,
    @Body('TBK_TOKEN') tbkToken: string | undefined,
    @Body('TBK_ORDEN_COMPRA') tbkOrdenCompra: string | undefined,
    @Res() res: Response,
  ) {
    return this.procesarRetorno(tokenWs, tbkOrdenCompra, tbkToken, res);
  }

  // Si el cliente hace clic en "Anular compra" en la página de Webpay,
  // o si la transacción expira por timeout, Transbank redirige con GET
  // en vez de POST y sin token_ws (trae TBK_TOKEN/TBK_ORDEN_COMPRA en su
  // lugar). Nunca hay que hacer commit() en ese caso.
  @Get('retorno')
  async retornoGet(
    @Query('token_ws') tokenWs: string | undefined,
    @Query('TBK_TOKEN') tbkToken: string | undefined,
    @Query('TBK_ORDEN_COMPRA') tbkOrdenCompra: string | undefined,
    @Res() res: Response,
  ) {
    return this.procesarRetorno(tokenWs, tbkOrdenCompra, tbkToken, res);
  }

  private async procesarRetorno(
    tokenWs: string | undefined,
    tbkOrdenCompra: string | undefined,
    tbkToken: string | undefined,
    res: Response,
  ) {
    try {
      if (tokenWs) {
        const resultado = await this.pagosService.confirmar(tokenWs);
        return res.redirect(
          this.urlResultado(
            resultado.reservaId,
            resultado.aprobado ? 'exitoso' : 'rechazado',
          ),
        );
      }

      if (tbkToken && tbkOrdenCompra) {
        const resultado = await this.pagosService.marcarAnulado(tbkOrdenCompra);
        return res.redirect(this.urlResultado(resultado.reservaId, 'anulado'));
      }

      // Caso raro (timeout sin ninguno de los dos): no tenemos cómo
      // identificar la reserva, así que solo mandamos a una pantalla
      // genérica de error en vez de reventar con un 500.
      return res.redirect(`${this.frontendUrl}/pago/resultado?estado=error`);
    } catch {
      return res.redirect(`${this.frontendUrl}/pago/resultado?estado=error`);
    }
  }

  private urlResultado(reservaId: number, estado: string): string {
    return `${this.frontendUrl}/pago/resultado?estado=${estado}&reserva=${reservaId}`;
  }
}
