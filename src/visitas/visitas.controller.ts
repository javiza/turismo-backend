import { Controller, Post, Body, Req, HttpCode } from '@nestjs/common';
import type { Request } from 'express';

import { VisitasService } from './visitas.service';
import { CreateVisitaDto } from './dto/create-visita.dto';

@Controller('visitas')
export class VisitasController {
  constructor(private readonly visitasService: VisitasService) {}

  // Público, sin autenticación: el frontend lo llama en cada vista de
  // ficha de destino/paquete. 204 porque al visitante no le importa (ni
  // debe ver) el registro creado.
  @Post()
  @HttpCode(204)
  async registrar(@Body() dto: CreateVisitaDto, @Req() req: Request) {
    await this.visitasService.registrar(dto, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }
}
