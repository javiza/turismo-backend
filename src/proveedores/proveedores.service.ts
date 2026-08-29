import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { EmailService } from '../email/email.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
    private readonly emailService: EmailService,
    private readonly whatsappService: WhatsappService,
  ) {}

  /**
   * Endpoint público: botón "Contacto proveedores" del home. Igual que
   * MensajesService.create(), el aviso al admin (correo + WhatsApp) no
   * debe bloquear ni hacer fallar la respuesta al proveedor: el registro
   * ya quedó guardado en base de datos, que es lo importante. Si el
   * correo o el WhatsApp fallan, cada servicio solo lo loguea.
   */
  async create(dto: CreateProveedorDto): Promise<Proveedor> {
    const proveedor = this.proveedorRepository.create({
      ...dto,
      leido: false,
    });

    const guardado = await this.proveedorRepository.save(proveedor);

    void this.emailService.notificarProveedorNuevo({
      nombreNegocio: guardado.nombreNegocio,
      rubro: guardado.rubro,
      nombreContacto: guardado.nombreContacto,
      correo: guardado.correo,
      telefono: guardado.telefono,
      direccion: guardado.direccion,
      descripcion: guardado.descripcion,
      precioReferencial: guardado.precioReferencial,
    });

    void this.whatsappService.notificarProveedorNuevo({
      nombreNegocio: guardado.nombreNegocio,
      rubro: guardado.rubro,
      nombreContacto: guardado.nombreContacto,
      correo: guardado.correo,
      telefono: guardado.telefono,
    });

    return guardado;
  }

  /** Panel admin: todos los proveedores registrados, más recientes primero. */
  async findAll(): Promise<Proveedor[]> {
    return this.proveedorRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findOne({
      where: { id },
    });

    if (!proveedor) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    return proveedor;
  }

  /** Marca un registro de proveedor como leído/no leído. */
  async update(id: number, dto: UpdateProveedorDto): Promise<Proveedor> {
    const proveedor = await this.findOne(id);
    proveedor.leido = dto.leido;
    return this.proveedorRepository.save(proveedor);
  }

  async remove(id: number): Promise<void> {
    const proveedor = await this.findOne(id);
    await this.proveedorRepository.remove(proveedor);
  }

  /** Contador para el badge del menú admin (mismo patrón que consultas no leídas). */
  async contarNoLeidos(): Promise<{ count: number }> {
    const count = await this.proveedorRepository.count({
      where: { leido: false },
    });
    return { count };
  }
}
