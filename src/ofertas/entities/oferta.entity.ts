import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Paquete } from '../../paquetes/entities/paquete.entity';
import { numericTransformer } from '../../common/transformers/numeric.transformer';

@Entity('ofertas')
export class Oferta {
  @PrimaryGeneratedColumn()
  id!: number;

  // Ver nota en paquetes/entities/paquete.entity.ts: no marcar insert:false/
  // update:false aquí, TypeORM reutiliza esta misma columna como columna
  // de join de la relación de abajo.
  @Column({ name: 'paquete_id' })
  paqueteId!: number;

  @ManyToOne(() => Paquete, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'paquete_id' })
  paquete!: Paquete;

  @Column({ length: 200 })
  titulo!: string;

  @Column('text', { nullable: true })
  descripcion?: string;

  // Porcentaje de descuento, 0-100
  @Column('numeric', {
    precision: 5,
    scale: 2,
    transformer: numericTransformer,
  })
  descuento!: number;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio!: string;

  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin!: string;

  @Column({ default: true })
  activa!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
