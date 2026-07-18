import {
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ClientesService } from './clientes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';

/**
 * Gestión de clientes desde el panel admin. El registro/login del propio
 * cliente vive en ClientesAuthModule (rutas /clientes-auth/*), separado a
 * propósito de este controller: acá solo entra un admin autenticado.
 */
@Controller('clientes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(+id);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.clientesService.deactivate(+id);
  }

  @Patch(':id/reactivate')
  reactivate(@Param('id') id: string) {
    return this.clientesService.reactivate(+id);
  }
}
