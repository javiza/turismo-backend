import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Cotizacion, EstadoCotizacion } from './entities/cotizacion.entity';
import { Paquete } from '../paquetes/entities/paquete.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Destino } from '../destinos/entities/destino.entity';
import { Noticia } from '../noticias/entities/noticia.entity';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { UpdateCotizacionDto } from './dto/update-cotizacion.dto';
import { AdminCotizacionDto } from './dto/admin-cotizacion.dto';
import {
  COTIZACION_CREADA_EVENT,
  COTIZACION_RESPONDIDA_EVENT,
  CotizacionCreadaEvent,
  CotizacionRespondidaEvent,
} from '../common/events/cotizacion.events';

@Injectable()
export class CotizacionesService {
  constructor(
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>,
    @InjectRepository(Paquete)
    private readonly paqueteRepository: Repository<Paquete>,
    @InjectRepository(Destino)
    private readonly destinoRepository: Repository<Destino>,
    @InjectRepository(Noticia)
    private readonly noticiaRepository: Repository<Noticia>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /** Público: botón "Consultar" sobre un paquete, un destino, una noticia, o cotización general. */
  async create(
    dto: CreateCotizacionDto,
    clienteId?: number,
  ): Promise<Cotizacion> {
    const cotizacion = this.cotizacionRepository.create({
      nombre: dto.nombre,
      email: dto.email,
      telefono: dto.telefono,
      cantidadPersonas: dto.cantidadPersonas ?? 1,
      mensaje: dto.mensaje,
      paquete: dto.paqueteId ? ({ id: dto.paqueteId } as Paquete) : undefined,
      destino: dto.destinoId ? ({ id: dto.destinoId } as Destino) : undefined,
      noticia: dto.noticiaId ? ({ id: dto.noticiaId } as Noticia) : undefined,
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
        throw new BadRequestException(
          'El paquete, destino o noticia indicado no existe',
        );
      }
      throw error;
    }

    // Nombre del paquete/destino/noticia para el correo (si la consulta
    // viene desde una ficha específica), sin bloquear la respuesta si falla.
    const nombrePaquete = dto.paqueteId
      ? (await this.paqueteRepository.findOne({ where: { id: dto.paqueteId } }))
          ?.nombre
      : undefined;

    const nombreDestino = dto.destinoId
      ? (await this.destinoRepository.findOne({ where: { id: dto.destinoId } }))
          ?.nombre
      : undefined;

    const nombreNoticia = dto.noticiaId
      ? (await this.noticiaRepository.findOne({ where: { id: dto.noticiaId } }))
          ?.titulo
      : undefined;

    this.eventEmitter.emit(
      COTIZACION_CREADA_EVENT,
      new CotizacionCreadaEvent(
        guardada.id,
        guardada.nombre,
        guardada.email,
        guardada.telefono,
        guardada.cantidadPersonas,
        guardada.mensaje,
        nombrePaquete,
        nombreDestino,
        nombreNoticia,
      ),
    );

    return guardada;
  }

  /** Panel admin: todas las cotizaciones, más recientes primero. */
  async findAll(): Promise<Cotizacion[]> {
    return this.cotizacionRepository.find({
      relations: { paquete: true, destino: true, noticia: true },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Conteo liviano de consultas no leídas, para el "ticket" de
   * notificación visible en el panel admin (badge en el menú, sin tener
   * que traer la lista completa solo para contar).
   */
  async contarNoLeidas(): Promise<{ count: number }> {
    const count = await this.cotizacionRepository.count({
      where: { leida: false },
    });
    return { count };
  }

  /** Historial del cliente autenticado (dashboard cliente). */
  async findByCliente(clienteId: number): Promise<Cotizacion[]> {
    return this.cotizacionRepository.find({
      where: { clienteId },
      relations: { paquete: true, destino: true, noticia: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Cotizacion> {
    const cotizacion = await this.cotizacionRepository.findOne({
      where: { id },
      relations: { paquete: true, destino: true, noticia: true },
    });

    if (!cotizacion) {
      throw new NotFoundException('Cotización no encontrada');
    }

    return cotizacion;
  }

  async updateEstado(
    id: number,
    dto: UpdateCotizacionDto,
  ): Promise<Cotizacion> {
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
      this.eventEmitter.emit(
        COTIZACION_RESPONDIDA_EVENT,
        new CotizacionRespondidaEvent(
          guardada.id,
          guardada.email,
          guardada.nombre,
          dto.respuesta,
          guardada.paquete?.nombre,
          guardada.destino?.nombre,
          guardada.noticia?.titulo,
        ),
      );
    }

    return guardada;
  }

  async remove(id: number): Promise<void> {
    const cotizacion = await this.findOne(id);
    await this.cotizacionRepository.remove(cotizacion);
  }
}
