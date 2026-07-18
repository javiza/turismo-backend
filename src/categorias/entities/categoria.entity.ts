import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Destino } from '../../destinos/entities/destino.entity';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100, unique: true })
  nombre!: string;

  @Column('text', { nullable: true })
  descripcion?: string;

  @ManyToMany(() => Destino, (destino) => destino.categorias)
  destinos?: Destino[];
}
