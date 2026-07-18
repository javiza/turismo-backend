import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Mensaje } from './entities/mensaje.entity';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { UpdateMensajeDto } from './dto/update-mensaje.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class MensajesService {
  constructor(
    @InjectRepository(Mensaje)
    private readonly mensajeRepository: Repository<Mensaje>,
    private readonly emailService: EmailService,
  ) {}

  /** Endpoint público: formulario de contacto del sitio. */
  async create(dto: CreateMensajeDto): Promise<Mensaje> {
    const mensaje = this.mensajeRepository.create({
      ...dto,
      leido: false,
    });

    const guardado = await this.mensajeRepository.save(mensaje);

    // El aviso al admin no debe bloquear ni hacer fallar la respuesta al
    // visitante: el mensaje ya quedó guardado en base de datos, que es lo
    // importante. Si el correo falla, EmailService solo lo loguea.
    void this.emailService.notificarNuevoMensaje({
      nombre: guardado.nombre,
      correo: guardado.correo,
      asunto: guardado.asunto,
      mensaje: guardado.mensaje,
    });

    return guardado;
  }

  /** Panel admin: todos los mensajes, más recientes primero. */
  async findAll(): Promise<Mensaje[]> {
    return this.mensajeRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Mensaje> {
    const mensaje = await this.mensajeRepository.findOne({ where: { id } });

    if (!mensaje) {
      throw new NotFoundException('Mensaje no encontrado');
    }

    return mensaje;
  }

  /** Marca un mensaje como leído/no leído. */
  async update(id: number, dto: UpdateMensajeDto): Promise<Mensaje> {
    const mensaje = await this.findOne(id);
    mensaje.leido = dto.leido;
    return this.mensajeRepository.save(mensaje);
  }

  async remove(id: number): Promise<void> {
    const mensaje = await this.findOne(id);
    await this.mensajeRepository.remove(mensaje);
  }
}
