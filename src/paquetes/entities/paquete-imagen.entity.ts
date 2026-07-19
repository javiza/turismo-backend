import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Paquete } from './paquete.entity';

/** Galería de imágenes de un paquete (tabla paquete_imagenes). */
@Entity('paquete_imagenes')
export class PaqueteImagen {
  @PrimaryGeneratedColumn()
  id!: number;

  // Ver nota en paquete.entity.ts: no marcar insert:false/update:false
  // acá, TypeORM reutiliza esta misma columna como columna de join de la
  // relación de abajo.
  @Column({ name: 'paquete_id' })
  paqueteId!: number;

  @ManyToOne(() => Paquete, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'paquete_id' })
  paquete!: Paquete;

  @Column('text')
  url!: string;

  // Imagen "de perfil" del paquete (la que se muestra en cards/listados).
  // Solo una fila por paquete debería tener es_principal = true; lo
  // garantiza PaquetesService.marcarPrincipal, no una constraint de DB.
  @Column({ name: 'es_principal', default: false })
  esPrincipal!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
