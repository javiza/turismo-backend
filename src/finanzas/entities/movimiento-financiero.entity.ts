import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
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

  @Column({ name: 'usuario_id', nullable: true })
  usuarioId?: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario?: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
