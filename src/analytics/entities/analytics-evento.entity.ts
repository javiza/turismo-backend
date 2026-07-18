import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Destino } from '../../destinos/entities/destino.entity';
import { Paquete } from '../../paquetes/entities/paquete.entity';

/**
 * Eventos de negocio de grano fino (clic en "reservar", clic en "compartir",
 * apertura de galería, etc.), separados de "visitas" (que es solo
 * apertura de ficha). metadata es JSONB de forma intencional: cada tipo
 * de evento puede llevar datos distintos sin tener que migrar el schema
 * cada vez que se agrega un evento nuevo.
 */
@Entity('analytics_eventos')
export class AnalyticsEvento {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'tipo_evento', length: 100 })
  tipoEvento!: string;

  @Column({ name: 'destino_id', nullable: true })
  destinoId?: number;

  @ManyToOne(() => Destino, { nullable: true })
  @JoinColumn({ name: 'destino_id' })
  destino?: Destino;

  @Column({ name: 'paquete_id', nullable: true })
  paqueteId?: number;

  @ManyToOne(() => Paquete, { nullable: true })
  @JoinColumn({ name: 'paquete_id' })
  paquete?: Paquete;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
