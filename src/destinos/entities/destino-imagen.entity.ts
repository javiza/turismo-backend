import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Destino } from './destino.entity';

/** Galería de imágenes de un destino (tabla destino_imagenes). */
@Entity('destino_imagenes')
export class DestinoImagen {
  @PrimaryGeneratedColumn()
  id!: number;

  // Ver nota en paquetes/entities/paquete.entity.ts: no marcar insert:false/
  // update:false aquí, TypeORM reutiliza esta misma columna como columna
  // de join de la relación de abajo.
  @Column({ name: 'destino_id' })
  destinoId!: number;

  @ManyToOne(() => Destino, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'destino_id' })
  destino!: Destino;

  @Column('text')
  url!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
