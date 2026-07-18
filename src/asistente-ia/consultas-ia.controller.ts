import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ConsultasIaService } from './consultas-ia.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';

/**
 * Panel de solo lectura para el admin: qué contestó la IA en su nombre y
 * qué quedó pendiente de respuesta humana. Escribir/editar respuestas no
 * tiene endpoint acá porque eso se hace directamente en Gmail (el correo
 * escalado queda como no leído en la bandeja real).
 */
@Controller('asistente-ia/consultas')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class ConsultasIaController {
  constructor(private readonly consultasIaService: ConsultasIaService) {}

  @Get()
  findAll() {
    return this.consultasIaService.findAll();
  }

  @Get('pendientes')
  findEscaladas() {
    return this.consultasIaService.findEscaladas();
  }
}
