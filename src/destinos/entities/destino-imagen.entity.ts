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

  // Marca cuál imagen de la galería es la "de perfil" (la que se usa como
  // imagen_principal en las cards/listados). Solo una fila por destino
  // debería tener es_principal = true; lo garantiza el servicio, no una
  // constraint de DB (se resuelve con un UPDATE previo, ver
  // DestinosService.marcarPrincipal).
  @Column({ name: 'es_principal', default: false })
  esPrincipal!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
