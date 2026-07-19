import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';

import { Cotizacion, EstadoCotizacion } from './entities/cotizacion.entity';
import { Paquete } from '../paquetes/entities/paquete.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Destino } from '../destinos/entities/destino.entity';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { UpdateCotizacionDto } from './dto/update-cotizacion.dto';
import { AdminCotizacionDto } from './dto/admin-cotizacion.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class CotizacionesService {
  constructor(
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>,
    @InjectRepository(Paquete)
    private readonly paqueteRepository: Repository<Paquete>,
    @InjectRepository(Destino)
    private readonly destinoRepository: Repository<Destino>,
    private readonly emailService: EmailService,
  ) {}

  /** Público: botón "Consultar" sobre un paquete, un destino, o cotización general. */
  async create(dto: CreateCotizacionDto, clienteId?: number): Promise<Cotizacion> {
    const cotizacion = this.cotizacionRepository.create({
      nombre: dto.nombre,
      email: dto.email,
      telefono: dto.telefono,
      cantidadPersonas: dto.cantidadPersonas ?? 1,
      mensaje: dto.mensaje,
      paquete: dto.paqueteId ? ({ id: dto.paqueteId } as Paquete) : undefined,
      destino: dto.destinoId ? ({ id: dto.destinoId } as Destino) : undefined,
      cliente: clienteId ? ({ id: clienteId } as Cliente) : undefined,
    });

    let guardada: Cotizacion;
    try {
      guardada = await this.cotizacionRepository.save(cotizacion);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as unknown as { code?: string }).code === '23503'
      ) {
        throw new BadRequestException('El paquete o destino indicado no existe');
      }
      throw error;
    }

    // Nombre del paquete/destino para el correo (si la consulta viene desde
    // una ficha específica), sin bloquear la respuesta si falla.
    const nombrePaquete = dto.paqueteId
      ? (await this.paqueteRepository.findOne({ where: { id: dto.paqueteId } }))?.nombre
      : undefined;

    const nombreDestino = dto.destinoId
      ? (await this.destinoRepository.findOne({ where: { id: dto.destinoId } }))?.nombre
      : undefined;

    void this.emailService.enviarConfirmacionCotizacion({
      email: guardada.email,
      nombre: guardada.nombre,
      nombrePaquete,
      nombreDestino,
    });

    // Este es el correo que realmente le llega al equipo (Gmail de la
    // agencia, ADMIN_NOTIFICATION_EMAIL) con la pregunta del visitante/
    // cliente, para que puedan responder.
    void this.emailService.notificarNuevaCotizacion({
      nombre: guardada.nombre,
      email: guardada.email,
      telefono: guardada.telefono,
      nombrePaquete,
      nombreDestino,
      cantidadPersonas: guardada.cantidadPersonas,
      mensaje: guardada.mensaje,
    });

    return guardada;
  }

  /** Panel admin: todas las cotizaciones, más recientes primero. */
  async findAll(): Promise<Cotizacion[]> {
    return this.cotizacionRepository.find({
      relations: { paquete: true, destino: true },
      order: { createdAt: 'DESC' },
    });
  }

  /** Historial del cliente autenticado (dashboard cliente). */
  async findByCliente(clienteId: number): Promise<Cotizacion[]> {
    return this.cotizacionRepository.find({
      where: { clienteId },
      relations: { paquete: true, destino: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Cotizacion> {
    const cotizacion = await this.cotizacionRepository.findOne({
      where: { id },
      relations: { paquete: true, destino: true },
    });

    if (!cotizacion) {
      throw new NotFoundException('Cotización no encontrada');
    }

    return cotizacion;
  }

  async updateEstado(id: number, dto: UpdateCotizacionDto): Promise<Cotizacion> {
    const cotizacion = await this.findOne(id);
    cotizacion.estado = dto.estado;
    return this.cotizacionRepository.save(cotizacion);
  }

  /**
   * Panel admin: responder la consulta y/o marcarla como leída. Escribir
   * una respuesta marca automáticamente leida=true, estado=RESPONDIDA y
   * dispara el correo al cliente con el contenido de la respuesta.
   */
  async updateAdmin(id: number, dto: AdminCotizacionDto): Promise<Cotizacion> {
    const cotizacion = await this.findOne(id);

    if (dto.leida !== undefined) {
      cotizacion.leida = dto.leida;
    }

    if (dto.estado !== undefined) {
      cotizacion.estado = dto.estado;
    }

    if (dto.respuesta !== undefined) {
      cotizacion.respuesta = dto.respuesta;
      cotizacion.respondidoEn = new Date();
      cotizacion.estado = EstadoCotizacion.RESPONDIDA;
      cotizacion.leida = true;
    }

    const guardada = await this.cotizacionRepository.save(cotizacion);

    if (dto.respuesta !== undefined) {
      void this.emailService.notificarRespuestaCotizacion({
        email: guardada.email,
        nombre: guardada.nombre,
        respuesta: dto.respuesta,
        nombrePaquete: guardada.paquete?.nombre,
        nombreDestino: guardada.destino?.nombre,
      });
    }

    return guardada;
  }

  async remove(id: number): Promise<void> {
    const cotizacion = await this.findOne(id);
    await this.cotizacionRepository.remove(cotizacion);
  }
}
