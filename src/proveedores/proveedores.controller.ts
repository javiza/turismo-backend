import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';

import { ProveedoresService } from './proveedores.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';
import { CloudinaryService } from '../storage/cloudinary.service';

@Controller('proveedores')
export class ProveedoresController {
  constructor(
    private readonly proveedoresService: ProveedoresService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  // --- Público: formulario "Contacto proveedores" del sitio ---
  @Post()
  create(@Body() dto: CreateProveedorDto) {
    return this.proveedoresService.create(dto);
  }

  // Subida de imagen para el formulario público de proveedores. Va sin
  // guard (a diferencia de POST /uploads/imagenes/:carpeta, que es solo
  // para el panel admin) porque quien completa este formulario todavía
  // no tiene sesión: es un negocio externo dejando sus datos por primera
  // vez. El front primero sube la imagen acá y luego manda la URL
  // resultante como "imagenUrl" en el POST /proveedores.
  @Post('imagen')
  @ApiOperation({
    summary: 'Sube la imagen del formulario público de proveedores',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('archivo', {
      storage: undefined, // memoria (buffer), no se escribe a disco
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async subirImagen(@UploadedFile() archivo: Express.Multer.File) {
    return this.cloudinary.subirImagen(archivo, 'proveedores');
  }

  // --- Panel admin ---
  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  findAll() {
    return this.proveedoresService.findAll();
  }

  @Get('no-leidos/count')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  contarNoLeidos() {
    return this.proveedoresService.contarNoLeidos();
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.proveedoresService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateProveedorDto) {
    return this.proveedoresService.update(+id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.proveedoresService.remove(+id);
  }
}
