import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Paquete } from '../../paquetes/entities/paquete.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Destino } from '../../destinos/entities/destino.entity';

export enum EstadoCotizacion {
  PENDIENTE = 'PENDIENTE',
  RESPONDIDA = 'RESPONDIDA',
  CERRADA = 'CERRADA',
}

/**
 * Solicitud de cotización: a diferencia de una Reserva, no reserva cupos
 * ni calcula montos — es un "quiero que me coticen esto" que un admin
 * revisa y responde manualmente (por eso paquete_id es opcional: puede
 * ser una consulta general, no necesariamente sobre un paquete existente).
 */
@Entity('cotizaciones')
export class Cotizacion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'paquete_id', nullable: true })
  paqueteId?: number;

  // Script-26.sql no define ON DELETE para esta FK (queda en NO ACTION,
  // igual que en destinos/paquetes), así que un paquete con cotizaciones
  // no se puede borrar directamente — paquetes.service.ts ya captura ese
  // 23503 y sugiere desactivar en vez de eliminar.
  @ManyToOne(() => Paquete, { nullable: true })
  @JoinColumn({ name: 'paquete_id' })
  paquete?: Paquete;

  // Igual que en Reserva: nullable para preservar cotizar sin cuenta.
  @Column({ name: 'cliente_id', nullable: true })
  clienteId?: number;

  @ManyToOne(() => Cliente, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente?: Cliente;

  // Consulta hecha desde la ficha de un destino (en vez de un paquete).
  // Igual que paqueteId: opcional, para no romper la consulta general.
  @Column({ name: 'destino_id', nullable: true })
  destinoId?: number;

  @ManyToOne(() => Destino, { nullable: true })
  @JoinColumn({ name: 'destino_id' })
  destino?: Destino;

  @Column({ length: 150 })
  nombre!: string;

  @Column({ length: 150 })
  email!: string;

  @Column({ length: 50, nullable: true })
  telefono?: string;

  @Column({ name: 'cantidad_personas', type: 'int', default: 1 })
  cantidadPersonas!: number;

  @Column('text', { nullable: true })
  mensaje?: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: EstadoCotizacion.PENDIENTE,
  })
  estado!: EstadoCotizacion;

  @Column('text', { nullable: true })
  respuesta?: string;

  @Column({ name: 'respondido_en', type: 'timestamp', nullable: true })
  respondidoEn?: Date;

  @Column({ default: false })
  leida!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
