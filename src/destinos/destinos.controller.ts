import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { DestinosService } from './destinos.service';
import { CreateDestinoDto } from './dto/create-destino.dto';
import { UpdateDestinoDto } from './dto/update-destino.dto';
import { AgregarImagenDto } from './dto/agregar-imagen.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';

/**
 * IMPORTANTE sobre el orden de las rutas: Nest/Express matchea en el
 * orden de declaración, así que TODAS las rutas estáticas ('admin/todos',
 * 'buscar') van antes que ':id' — si no, ':id' las intercepta primero
 * (p.ej. GET /destinos/buscar terminaría llamando a findOne('buscar')).
 */
@Controller('destinos')
export class DestinosController {
  constructor(private readonly destinosService: DestinosService) {}

  // --- Lectura pública: visitantes y clientes ven lo mismo ---

  @Get()
  findAll() {
    return this.destinosService.findAll();
  }

  @Get('buscar')
  buscar(@Query('q') q: string) {
    return this.destinosService.buscar(q);
  }

  @Get('admin/todos')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  findAllAdmin() {
    return this.destinosService.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.destinosService.findOne(+id);
  }

  // --- Escritura: solo administradores ---

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  create(@Body() dto: CreateDestinoDto) {
    return this.destinosService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateDestinoDto) {
    return this.destinosService.update(+id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.destinosService.remove(+id);
  }

  // --- Galería de imágenes (admin) ---

  @Post(':id/imagenes')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  agregarImagen(@Param('id') id: string, @Body() dto: AgregarImagenDto) {
    return this.destinosService.agregarImagen(+id, dto.url);
  }

  @Delete(':id/imagenes/:imagenId')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  eliminarImagen(
    @Param('id') id: string,
    @Param('imagenId') imagenId: string,
  ) {
    return this.destinosService.eliminarImagen(+id, +imagenId);
  }

  // --- Categorías (admin) ---

  @Post(':id/categorias/:categoriaId')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  agregarCategoria(
    @Param('id') id: string,
    @Param('categoriaId') categoriaId: string,
  ) {
    return this.destinosService.agregarCategoria(+id, +categoriaId);
  }

  @Delete(':id/categorias/:categoriaId')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  quitarCategoria(
    @Param('id') id: string,
    @Param('categoriaId') categoriaId: string,
  ) {
    return this.destinosService.quitarCategoria(+id, +categoriaId);
  }
}
