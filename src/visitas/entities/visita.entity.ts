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
 * Registro de visitas a una ficha de destino o de paquete. Es la fuente
 * de datos real detrás de mv_destinos_populares, mv_paquetes_populares,
 * top_destinos() y tendencia_mensual() (Script-26.sql) — sin esto esas
 * vistas/funciones siempre devuelven 0 visitas.
 */
@Entity('visitas')
export class Visita {
  @PrimaryGeneratedColumn()
  id!: number;

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

  @Column({ length: 100, nullable: true })
  ip?: string;

  @Column({ length: 100, nullable: true })
  pais?: string;

  @Column({ length: 100, nullable: true })
  ciudad?: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
