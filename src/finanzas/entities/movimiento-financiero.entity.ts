import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { numericTransformer } from '../../common/transformers/numeric.transformer';

/**
 * INGRESO_MANUAL / EGRESO_MANUAL: dinero que entró o salió por fuera del
 * flujo de reservas (efectivo recibido a mano, un gasto operativo, etc).
 *
 * ROBO / ESTAFA / PERDIDA: dinero que se dio por perdido. Se registran
 * como su propio tipo (no como "egreso" genérico) a propósito, para que
 * el resumen financiero pueda mostrar aparte "cuánto se perdió por estos
 * motivos" sin que se confunda con un gasto operativo normal ni, sobre
 * todo, con los ingresos reales por ventas — ver nota grande en
 * FinanzasService.resumen().
 *
 * AJUSTE: correcciones de montos que no encajan en las categorías
 * anteriores (p. ej. arreglar un error de tipeo de una carga anterior).
 */
export enum TipoMovimientoFinanciero {
  INGRESO_MANUAL = 'INGRESO_MANUAL',
  EGRESO_MANUAL = 'EGRESO_MANUAL',
  ROBO = 'ROBO',
  ESTAFA = 'ESTAFA',
  PERDIDA = 'PERDIDA',
  AJUSTE = 'AJUSTE',
}

/**
 * Categoría del gasto. Solo tiene sentido cuando tipo = EGRESO_MANUAL
 * (ver validación en el DTO); para el resto de los tipos queda null.
 * Sirve para poder desglosar "en qué se fue la plata" en el resumen
 * financiero, en vez de tener un solo monto agregado de egresos.
 */
export enum CategoriaGasto {
  OPERACIONAL = 'OPERACIONAL',
  SUELDOS = 'SUELDOS',
  MARKETING = 'MARKETING',
  PROVEEDORES = 'PROVEEDORES',
  MANTENIMIENTO = 'MANTENIMIENTO',
  IMPUESTOS = 'IMPUESTOS',
  OTRO = 'OTRO',
}

/** Método de pago del ingreso. Solo tiene sentido cuando tipo = INGRESO_MANUAL. */
export enum MetodoPago {
  EFECTIVO = 'EFECTIVO',
  TRANSFERENCIA = 'TRANSFERENCIA',
  TARJETA = 'TARJETA',
  WEBPAY = 'WEBPAY',
  OTRO = 'OTRO',
}

@Entity('movimientos_financieros')
export class MovimientoFinanciero {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 30 })
  tipo!: TipoMovimientoFinanciero;

  @Column('numeric', {
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  monto!: number;

  @Column('text')
  descripcion!: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  categoria?: CategoriaGasto | null;

  @Column({ name: 'usuario_id', nullable: true })
  usuarioId?: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario?: User;

  // "Quién pagó" — detalle del ingreso manual (requerimiento de negocio:
  // por ahora se carga a mano, más adelante se podría llenar solo desde
  // una pasarela de pago real). Dos formas de identificar al pagador,
  // no excluyentes: vínculo a un cliente con cuenta (clienteId) y/o un
  // nombre libre (pagadorNombre) para pagos en efectivo de alguien sin
  // cuenta registrada. Solo tienen sentido cuando tipo = INGRESO_MANUAL.
  @Column({ name: 'cliente_id', nullable: true })
  clienteId?: number | null;

  @ManyToOne(() => Cliente, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente?: Cliente | null;

  @Column({ name: 'pagador_nombre', type: 'varchar', length: 150, nullable: true })
  pagadorNombre?: string | null;

  @Column({ name: 'metodo_pago', type: 'varchar', length: 30, nullable: true })
  metodoPago?: MetodoPago | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
