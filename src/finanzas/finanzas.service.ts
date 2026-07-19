import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Reserva, EstadoReserva } from '../reservas/entities/reserva.entity';
import {
  MovimientoFinanciero,
  TipoMovimientoFinanciero,
} from './entities/movimiento-financiero.entity';
import { CreateMovimientoFinancieroDto } from './dto/create-movimiento-financiero.dto';
import { Role } from '../common/constants/roles.enum';

const TIPOS_PERDIDA = [
  TipoMovimientoFinanciero.ROBO,
  TipoMovimientoFinanciero.ESTAFA,
  TipoMovimientoFinanciero.PERDIDA,
];

export interface ResumenFinanciero {
  ingresosConfirmados: number;
  ingresosPendientes: number;
  ingresosCancelados: number;
  ticketPromedio: number;
  totalReservas: number;
  reservasConfirmadas: number;
  reservasPendientes: number;
  reservasCanceladas: number;
  personasConfirmadas: number;
  // Movimientos manuales: SIEMPRE aparte de lo anterior. Ver nota en
  // resumen() sobre por qué nunca se suman a ingresosConfirmados.
  ingresosManuales: number;
  egresosManuales: number;
  perdidasManuales: number; // robo + estafa + pérdida, sumados
  balanceTotal: number;
}

export interface IngresoMensual {
  mes: string; // YYYY-MM-01
  confirmados: number;
  pendientes: number;
  cancelados: number;
}

export interface IngresoPorItem {
  id: number;
  nombre: string;
  ingresos: number;
  reservas: number;
}

@Injectable()
export class FinanzasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(MovimientoFinanciero)
    private readonly movimientoRepository: Repository<MovimientoFinanciero>,
  ) {}

  /**
   * Totales generales. "Confirmados" es el único monto que cuenta como
   * ingreso real de ventas; "pendientes" es ingreso potencial (reservas
   * todavía sin confirmar) y "cancelados" se reporta aparte como
   * referencia de ingreso perdido, nunca sumado a los otros dos.
   *
   * Los movimientos financieros manuales (ingreso/egreso a mano, robo,
   * estafa, pérdida, ajuste) se suman en columnas propias y separadas.
   * Esto es intencional: un robo o una estafa NO debe poder maquillar
   * ni inflar ingresosConfirmados (que viene solo de reservas reales), y
   * tampoco un ingreso manual (p. ej. efectivo recibido en oficina) debe
   * mezclarse con la venta de paquetes. balanceTotal es la única cifra
   * que combina todo, y se calcula explícitamente al final, nunca
   * reasignando ingresosConfirmados.
   */
  async resumen(): Promise<ResumenFinanciero> {
    const filas = await this.reservaRepository
      .createQueryBuilder('reserva')
      .select('reserva.estado', 'estado')
      .addSelect('COALESCE(SUM(reserva.montoTotal), 0)', 'monto')
      .addSelect('COUNT(*)', 'cantidad')
      .addSelect('COALESCE(SUM(reserva.cantidadPersonas), 0)', 'personas')
      .groupBy('reserva.estado')
      .getRawMany<{
        estado: EstadoReserva;
        monto: string;
        cantidad: string;
        personas: string;
      }>();

    const porEstado = (estado: EstadoReserva) =>
      filas.find((f) => f.estado === estado);

    const confirmadas = porEstado(EstadoReserva.CONFIRMADA);
    const pendientes = porEstado(EstadoReserva.PENDIENTE);
    const canceladas = porEstado(EstadoReserva.CANCELADA);

    const ingresosConfirmados = Number(confirmadas?.monto ?? 0);
    const reservasConfirmadas = Number(confirmadas?.cantidad ?? 0);

    const { ingresosManuales, egresosManuales, perdidasManuales } =
      await this.totalesMovimientosManuales();

    return {
      ingresosConfirmados,
      ingresosPendientes: Number(pendientes?.monto ?? 0),
      ingresosCancelados: Number(canceladas?.monto ?? 0),
      ticketPromedio:
        reservasConfirmadas > 0
          ? Number((ingresosConfirmados / reservasConfirmadas).toFixed(2))
          : 0,
      totalReservas: filas.reduce((acc, f) => acc + Number(f.cantidad), 0),
      reservasConfirmadas,
      reservasPendientes: Number(pendientes?.cantidad ?? 0),
      reservasCanceladas: Number(canceladas?.cantidad ?? 0),
      personasConfirmadas: Number(confirmadas?.personas ?? 0),
      ingresosManuales,
      egresosManuales,
      perdidasManuales,
      balanceTotal: Number(
        (
          ingresosConfirmados +
          ingresosManuales -
          egresosManuales -
          perdidasManuales
        ).toFixed(2),
      ),
    };
  }

  private async totalesMovimientosManuales(): Promise<{
    ingresosManuales: number;
    egresosManuales: number;
    perdidasManuales: number;
  }> {
    const filas = await this.movimientoRepository
      .createQueryBuilder('m')
      .select('m.tipo', 'tipo')
      .addSelect('COALESCE(SUM(m.monto), 0)', 'monto')
      .groupBy('m.tipo')
      .getRawMany<{ tipo: TipoMovimientoFinanciero; monto: string }>();

    const monto = (tipo: TipoMovimientoFinanciero) =>
      Number(filas.find((f) => f.tipo === tipo)?.monto ?? 0);

    return {
      ingresosManuales: monto(TipoMovimientoFinanciero.INGRESO_MANUAL),
      egresosManuales: monto(TipoMovimientoFinanciero.EGRESO_MANUAL),
      perdidasManuales: TIPOS_PERDIDA.reduce(
        (acc, tipo) => acc + monto(tipo),
        0,
      ),
    };
  }

  /** Lista de movimientos manuales, más recientes primero. */
  async listarMovimientos(): Promise<MovimientoFinanciero[]> {
    return this.movimientoRepository.find({
      relations: { usuario: true },
      order: { createdAt: 'DESC' },
      take: 200,
    });
  }

  async registrarMovimiento(
    dto: CreateMovimientoFinancieroDto,
    usuarioId: number,
  ): Promise<MovimientoFinanciero> {
    const movimiento = this.movimientoRepository.create({
      ...dto,
      usuarioId,
    });
    return this.movimientoRepository.save(movimiento);
  }

  /**
   * Solo SUPER_ADMIN puede borrar un movimiento manual. Un ADMIN normal
   * puede cargar un robo/estafa/pérdida pero no puede hacerlo
   * desaparecer del historial después — eso protege el registro de
   * pérdidas de ser "limpiado" por la misma persona que lo generó o que
   * comete un fraude.
   */
  async eliminarMovimiento(id: number, rol: string): Promise<void> {
    if (rol !== (Role.SUPER_ADMIN as string)) {
      throw new ForbiddenException(
        'Solo un super administrador puede eliminar movimientos financieros',
      );
    }
    await this.movimientoRepository.delete(id);
  }

  /** Ingresos mes a mes (últimos 12 meses), desglosados por estado. */
  async ingresosMensuales(): Promise<IngresoMensual[]> {
    const filas = await this.reservaRepository
      .createQueryBuilder('reserva')
      .select(`date_trunc('month', reserva.fechaReserva)`, 'mes')
      .addSelect('reserva.estado', 'estado')
      .addSelect('COALESCE(SUM(reserva.montoTotal), 0)', 'monto')
      .where(`reserva.fechaReserva >= now() - interval '12 months'`)
      .groupBy('mes')
      .addGroupBy('reserva.estado')
      .orderBy('mes', 'ASC')
      .getRawMany<{ mes: Date; estado: EstadoReserva; monto: string }>();

    const porMes = new Map<string, IngresoMensual>();

    for (const fila of filas) {
      const clave = fila.mes.toISOString().slice(0, 10);
      if (!porMes.has(clave)) {
        porMes.set(clave, {
          mes: clave,
          confirmados: 0,
          pendientes: 0,
          cancelados: 0,
        });
      }
      const entrada = porMes.get(clave)!;
      const monto = Number(fila.monto);
      if (fila.estado === EstadoReserva.CONFIRMADA) entrada.confirmados = monto;
      else if (fila.estado === EstadoReserva.PENDIENTE)
        entrada.pendientes = monto;
      else if (fila.estado === EstadoReserva.CANCELADA)
        entrada.cancelados = monto;
    }

    return Array.from(porMes.values()).sort((a, b) =>
      a.mes.localeCompare(b.mes),
    );
  }

  /** Top paquetes por ingresos confirmados. */
  async topPaquetes(limite = 5): Promise<IngresoPorItem[]> {
    const filas = await this.reservaRepository
      .createQueryBuilder('reserva')
      .innerJoin('reserva.paquete', 'paquete')
      .select('paquete.id', 'id')
      .addSelect('paquete.nombre', 'nombre')
      .addSelect('COALESCE(SUM(reserva.montoTotal), 0)', 'ingresos')
      .addSelect('COUNT(*)', 'reservas')
      .where('reserva.estado = :estado', { estado: EstadoReserva.CONFIRMADA })
      .groupBy('paquete.id')
      .addGroupBy('paquete.nombre')
      .orderBy('ingresos', 'DESC')
      .limit(limite)
      .getRawMany<{
        id: number;
        nombre: string;
        ingresos: string;
        reservas: string;
      }>();

    return filas.map((f) => ({
      id: f.id,
      nombre: f.nombre,
      ingresos: Number(f.ingresos),
      reservas: Number(f.reservas),
    }));
  }

  /** Top destinos por ingresos confirmados (a través de sus paquetes). */
  async topDestinos(limite = 5): Promise<IngresoPorItem[]> {
    const filas = await this.reservaRepository
      .createQueryBuilder('reserva')
      .innerJoin('reserva.paquete', 'paquete')
      .innerJoin('paquete.destino', 'destino')
      .select('destino.id', 'id')
      .addSelect('destino.nombre', 'nombre')
      .addSelect('COALESCE(SUM(reserva.montoTotal), 0)', 'ingresos')
      .addSelect('COUNT(*)', 'reservas')
      .where('reserva.estado = :estado', { estado: EstadoReserva.CONFIRMADA })
      .groupBy('destino.id')
      .addGroupBy('destino.nombre')
      .orderBy('ingresos', 'DESC')
      .limit(limite)
      .getRawMany<{
        id: number;
        nombre: string;
        ingresos: string;
        reservas: string;
      }>();

    return filas.map((f) => ({
      id: f.id,
      nombre: f.nombre,
      ingresos: Number(f.ingresos),
      reservas: Number(f.reservas),
    }));
  }
}
