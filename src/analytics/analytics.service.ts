import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { AnalyticsEvento } from './entities/analytics-evento.entity';
import { CreateAnalyticsEventoDto } from './dto/create-analytics-evento.dto';
import { Destino } from '../destinos/entities/destino.entity';
import { Paquete } from '../paquetes/entities/paquete.entity';

interface TopItem {
  id: number;
  nombre: string;
  visitas: string; // bigint de Postgres llega como string
}

interface TendenciaMes {
  mes: string;
  visitas: string;
}

interface VentaMensual {
  mes: Date;
  reservas: string;
  ingresos: string | null;
}

/**
 * Todo el "big data ligero" que ya estaba diseñado en Script-26.sql
 * (funciones top_destinos/top_paquetes/tendencia_mensual/dashboard_general
 * + las 3 vistas materializadas) pero que ningún módulo llamaba todavía.
 * Este servicio es el que finalmente los conecta a un endpoint HTTP.
 */
@Injectable()
export class AnalyticsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(AnalyticsEvento)
    private readonly eventoRepository: Repository<AnalyticsEvento>,
  ) {}

  async registrarEvento(dto: CreateAnalyticsEventoDto): Promise<void> {
    const evento = this.eventoRepository.create({
      tipoEvento: dto.tipoEvento,
      destino: dto.destinoId ? ({ id: dto.destinoId } as Destino) : undefined,
      paquete: dto.paqueteId ? ({ id: dto.paqueteId } as Paquete) : undefined,
      metadata: dto.metadata,
    });

    await this.eventoRepository.save(evento);
  }

  async dashboard(): Promise<Record<string, number>> {
    const [row] = await this.dataSource.query<{ dashboard_general: Record<string, number> }[]>(
      'SELECT dashboard_general()',
    );
    return row.dashboard_general;
  }

  async topDestinos(): Promise<{ id: number; nombre: string; visitas: number }[]> {
    const rows = await this.dataSource.query<TopItem[]>('SELECT * FROM top_destinos()');
    return rows.map((r) => ({ ...r, visitas: Number(r.visitas) }));
  }

  async topPaquetes(): Promise<{ id: number; nombre: string; visitas: number }[]> {
    const rows = await this.dataSource.query<TopItem[]>('SELECT * FROM top_paquetes()');
    return rows.map((r) => ({ ...r, visitas: Number(r.visitas) }));
  }

  async tendenciaMensual(): Promise<{ mes: string; visitas: number }[]> {
    const rows = await this.dataSource.query<TendenciaMes[]>(
      'SELECT * FROM tendencia_mensual()',
    );
    return rows.map((r) => ({ mes: r.mes, visitas: Number(r.visitas) }));
  }

  /**
   * Lee de la vista materializada mv_ventas_mensuales. Ojo: las vistas
   * materializadas NO se actualizan solas — hay que hacer
   * REFRESH MATERIALIZED VIEW cuando cambian los datos. Ver
   * refrescarVistas() más abajo.
   */
  async ventasMensuales(): Promise<{ mes: Date; reservas: number; ingresos: number }[]> {
    const rows = await this.dataSource.query<VentaMensual[]>(
      'SELECT * FROM mv_ventas_mensuales ORDER BY mes ASC',
    );
    return rows.map((r) => ({
      mes: r.mes,
      reservas: Number(r.reservas),
      ingresos: r.ingresos ? Number(r.ingresos) : 0,
    }));
  }

  /**
   * Refresca las 3 vistas materializadas. Como no hay pg_cron configurado
   * en Script-26.sql, esto se deja como acción manual del admin desde el
   * panel; lo ideal a futuro es automatizarlo con pg_cron (a nivel de
   * base de datos) o con un cron job del sistema operativo que le pegue
   * a este endpoint una vez al día.
   */
  async refrescarVistas(): Promise<void> {
    await this.dataSource.query('REFRESH MATERIALIZED VIEW mv_destinos_populares');
    await this.dataSource.query('REFRESH MATERIALIZED VIEW mv_paquetes_populares');
    await this.dataSource.query('REFRESH MATERIALIZED VIEW mv_ventas_mensuales');
  }
}
