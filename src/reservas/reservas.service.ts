import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Reserva, EstadoReserva } from './entities/reserva.entity';
import { Paquete } from '../paquetes/entities/paquete.entity';
import { Oferta } from '../ofertas/entities/oferta.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { AdminUpdateReservaDto } from './dto/admin-update-reserva.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Crea una reserva verificando cupos disponibles de forma segura ante
   * concurrencia: bloquea la fila del paquete (SELECT ... FOR UPDATE)
   * dentro de una transacción, así dos reservas simultáneas para el
   * último cupo no pueden "pasar" las dos a la vez — la segunda espera
   * a que la primera termine y ve el cupo ya actualizado.
   *
   * paquetes.cupos se interpreta como capacidad TOTAL (no hay columna de
   * cupos restantes en el schema). La disponibilidad se calcula restando
   * la suma de cantidad_personas de reservas no canceladas.
   */
  async create(dto: CreateReservaDto, clienteId?: number): Promise<Reserva> {
    return this.reservaRepository.manager.transaction(async (manager) => {
      const paquete = await manager
        .getRepository(Paquete)
        .createQueryBuilder('paquete')
        .setLock('pessimistic_write')
        .where('paquete.id = :id', { id: dto.paqueteId })
        .getOne();

      if (!paquete || !paquete.activo) {
        throw new NotFoundException('Paquete no encontrado o inactivo');
      }

      const raw = await manager
        .getRepository(Reserva)
        .createQueryBuilder('reserva')
        .select('COALESCE(SUM(reserva.cantidadPersonas), 0)', 'ocupados')
        .where('reserva.paqueteId = :id', { id: dto.paqueteId })
        .andWhere('reserva.estado != :cancelada', {
          cancelada: EstadoReserva.CANCELADA,
        })
        .getRawOne<{ ocupados: string }>();

      const disponibles = paquete.cupos - Number(raw?.ocupados ?? 0);

      if (dto.cantidadPersonas > disponibles) {
        throw new ConflictException(
          disponibles > 0
            ? `Solo quedan ${disponibles} cupo(s) disponibles para este paquete`
            : 'No quedan cupos disponibles para este paquete',
        );
      }

      const descuentoPct = await this.obtenerDescuentoActivo(
        manager.getRepository(Oferta),
        dto.paqueteId,
      );

      const montoTotal =
        paquete.precio * dto.cantidadPersonas * (1 - descuentoPct / 100);

      const reserva = manager.getRepository(Reserva).create({
        nombreCliente: dto.nombreCliente,
        emailCliente: dto.emailCliente,
        telefono: dto.telefono,
        cantidadPersonas: dto.cantidadPersonas,
        montoTotal: Number(montoTotal.toFixed(2)),
        estado: EstadoReserva.PENDIENTE,
        paquete: { id: dto.paqueteId } as Paquete,
        cliente: clienteId ? { id: clienteId } : undefined,
      });

      const guardada = await manager.getRepository(Reserva).save(reserva);

      // El correo se dispara fuera de la transacción (fire-and-forget):
      // si el envío falla o demora, la reserva ya quedó confirmada en
      // base de datos y no debe revertirse por eso.
      if (dto.emailCliente) {
        void this.emailService.enviarConfirmacionReserva({
          email: dto.emailCliente,
          nombreCliente: dto.nombreCliente,
          nombrePaquete: paquete.nombre,
          cantidadPersonas: dto.cantidadPersonas,
          montoTotal: guardada.montoTotal,
          fechaInicio: paquete.fechaInicio,
          fechaFin: paquete.fechaFin,
        });
      }

      return guardada;
    });
  }

  private async obtenerDescuentoActivo(
    ofertaRepository: Repository<Oferta>,
    paqueteId: number,
  ): Promise<number> {
    const hoy = new Date().toISOString().slice(0, 10);

    const oferta = await ofertaRepository
      .createQueryBuilder('oferta')
      .where('oferta.paqueteId = :paqueteId', { paqueteId })
      .andWhere('oferta.activa = true')
      .andWhere('oferta.fechaInicio <= :hoy', { hoy })
      .andWhere('oferta.fechaFin >= :hoy', { hoy })
      .orderBy('oferta.descuento', 'DESC')
      .getOne();

    return oferta?.descuento ?? 0;
  }

  /** Panel admin: todas las reservas, con el paquete y la cuenta de cliente (si la reserva no fue de invitado). */
  async findAll(): Promise<Reserva[]> {
    return this.reservaRepository.find({
      relations: { paquete: { destino: true }, cliente: true },
      order: { fechaReserva: 'DESC' },
    });
  }

  /** Historial del cliente autenticado (dashboard cliente). */
  async findByCliente(clienteId: number): Promise<Reserva[]> {
    return this.reservaRepository.find({
      where: { clienteId },
      relations: { paquete: true },
      order: { fechaReserva: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOne({
      where: { id },
      relations: { paquete: { destino: true }, cliente: true },
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    return reserva;
  }

  /** Cambia el estado (confirmar / cancelar). Solo administradores. */
  async updateEstado(id: number, dto: UpdateReservaDto): Promise<Reserva> {
    const reserva = await this.findOne(id);

    if (reserva.estado === EstadoReserva.CANCELADA) {
      throw new BadRequestException(
        'La reserva ya está cancelada, no se puede modificar',
      );
    }

    reserva.estado = dto.estado;
    return this.reservaRepository.save(reserva);
  }

  /**
   * Edición completa desde el panel admin: datos de contacto, cantidad
   * de personas, monto y/o estado. Pensado para corregir errores de
   * tipeo o ajustar montos manualmente (ej. tras negociar con el
   * cliente), no para re-calcular disponibilidad de cupos.
   */
  async update(id: number, dto: AdminUpdateReservaDto): Promise<Reserva> {
    const reserva = await this.findOne(id);

    Object.assign(reserva, dto);

    return this.reservaRepository.save(reserva);
  }

  /** Elimina definitivamente una reserva. Solo administradores. */
  async remove(id: number): Promise<void> {
    const reserva = await this.findOne(id);
    await this.reservaRepository.remove(reserva);
  }
}
