import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Reserva } from '../../reservas/entities/reserva.entity';
import { numericTransformer } from '../../common/transformers/numeric.transformer';

/**
 * INICIADO: se creó la transacción en Transbank y se redirigió al
 * cliente a Webpay, pero todavía no hay resultado (no confundir con un
 * pago "pendiente de confirmación admin" — esto es solo el paso previo
 * a que el banco responda).
 * AUTORIZADO: el banco aprobó el pago (status AUTHORIZED + response_code
 * 0 en la respuesta de Transbank). PagosService.confirmar() marca la
 * reserva como CONFIRMADA en este momento.
 * RECHAZADO: Transbank llamó de vuelta pero el banco rechazó el pago.
 * ANULADO: el cliente abortó el pago desde la página de Webpay antes de
 * terminar (Transbank redirige distinto en ese caso, ver
 * PagosController.retorno).
 */
export enum EstadoPagoWebpay {
  INICIADO = 'INICIADO',
  AUTORIZADO = 'AUTORIZADO',
  RECHAZADO = 'RECHAZADO',
  ANULADO = 'ANULADO',
}

@Entity('pagos_webpay')
export class PagoWebpay {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'reserva_id' })
  reservaId!: number;

  @ManyToOne(() => Reserva, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'reserva_id' })
  reserva!: Reserva;

  // Identificador único que le damos nosotros a la orden (máx. 26
  // caracteres, límite de Transbank). Se arma en PagosService a partir
  // del id de la reserva + timestamp, para poder reintentar el pago de
  // una misma reserva sin chocar con la orden anterior.
  @Column({ name: 'buy_order', length: 26, unique: true })
  buyOrder!: string;

  @Column({ name: 'session_id', length: 61 })
  sessionId!: string;

  // Token que entrega Transbank al crear la transacción; es el mismo
  // que vuelve en el POST de retorno (token_ws) y con el que se hace
  // el commit(). Null hasta que create() responde.
  @Column({ type: 'varchar', length: 64, nullable: true })
  token?: string | null;

  @Column('numeric', {
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  monto!: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: EstadoPagoWebpay.INICIADO,
  })
  estado!: EstadoPagoWebpay;

  @Column({ name: 'codigo_autorizacion', type: 'varchar', length: 20, nullable: true })
  codigoAutorizacion?: string | null;

  @Column({ name: 'codigo_respuesta', type: 'int', nullable: true })
  codigoRespuesta?: number | null;

  // payment_type_code de Transbank (ej. "VD" débito, "VN" crédito normal).
  @Column({ name: 'tipo_pago', type: 'varchar', length: 5, nullable: true })
  tipoPago?: string | null;

  @Column({ name: 'cuotas', type: 'int', nullable: true })
  cuotas?: number | null;

  @Column({ name: 'ultimos_digitos_tarjeta', type: 'varchar', length: 4, nullable: true })
  ultimosDigitosTarjeta?: string | null;

  @Column({ name: 'fecha_transaccion', type: 'timestamptz', nullable: true })
  fechaTransaccion?: Date | null;

  // Respuesta completa de Transbank (create + commit), para poder
  // auditar/depurar un pago sin depender de que quede en los logs.
  @Column({ name: 'respuesta_cruda', type: 'jsonb', nullable: true })
  respuestaCruda?: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}