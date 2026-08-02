import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity('noticias')
export class Noticia {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 200 })
  titulo!: string;

  @Column('text')
  contenido!: string;

  @Column({ name: 'imagen_url', type: 'text', nullable: true })
  imagenUrl?: string;

  // Publicada/visible en el sitio público vs. borrador.
  @Column({ default: true })
  activa!: boolean;

  @Column({ name: 'autor_id', nullable: true })
  autorId?: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'autor_id' })
  autor?: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
