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
import { numericTransformer } from '../../common/transformers/numeric.transformer';

export enum EstadoReserva {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADA = 'CONFIRMADA',
  CANCELADA = 'CANCELADA',
}

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn()
  id!: number;

  // Ver nota en paquetes/entities/paquete.entity.ts: no marcar insert:false/
  // update:false aquí, TypeORM reutiliza esta misma columna como columna
  // de join de la relación de abajo.
  @Column({ name: 'paquete_id' })
  paqueteId!: number;

  @ManyToOne(() => Paquete, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn({ name: 'paquete_id' })
  paquete!: Paquete;

  // Nullable a propósito: preserva el "checkout como invitado" (reservar
  // sin cuenta). Si la reserva se hizo con sesión de cliente iniciada,
  // ReservasController la completa automáticamente desde el token — no es
  // un campo que el cliente pueda escribir directo por el DTO.
  @Column({ name: 'cliente_id', nullable: true })
  clienteId?: number;

  @ManyToOne(() => Cliente, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente?: Cliente;

  @Column({ name: 'nombre_cliente', length: 150 })
  nombreCliente!: string;

  @Column({ name: 'email_cliente', length: 150, nullable: true })
  emailCliente?: string;

  @Column({ length: 50, nullable: true })
  telefono?: string;

  @Column({ name: 'cantidad_personas', type: 'int' })
  cantidadPersonas!: number;

  @Column('numeric', {
    name: 'monto_total',
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: numericTransformer,
  })
  montoTotal?: number;

  @Column({
    type: 'varchar',
    length: 30,
    default: EstadoReserva.PENDIENTE,
  })
  estado!: EstadoReserva;

  @CreateDateColumn({ name: 'fecha_reserva' })
  fechaReserva!: Date;
}
