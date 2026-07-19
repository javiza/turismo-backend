import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Oferta } from './oferta.entity';

/** Galería de imágenes de una oferta (tabla oferta_imagenes). */
@Entity('oferta_imagenes')
export class OfertaImagen {
  @PrimaryGeneratedColumn()
  id!: number;

  // Ver nota en paquete.entity.ts: no marcar insert:false/update:false
  // acá, TypeORM reutiliza esta misma columna como columna de join de la
  // relación de abajo.
  @Column({ name: 'oferta_id' })
  ofertaId!: number;

  @ManyToOne(() => Oferta, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'oferta_id' })
  oferta!: Oferta;

  @Column('text')
  url!: string;

  // Imagen "de perfil" de la oferta (la que se muestra en cards/listados).
  // Solo una fila por oferta debería tener es_principal = true; lo
  // garantiza OfertasService.marcarPrincipal, no una constraint de DB.
  @Column({ name: 'es_principal', default: false })
  esPrincipal!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
