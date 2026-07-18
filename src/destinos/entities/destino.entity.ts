import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { numericTransformer } from '../../common/transformers/numeric.transformer';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { DestinoImagen } from './destino-imagen.entity';

@Entity('destinos')
export class Destino {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 200 })
  nombre!: string;

  @Column('text')
  descripcion!: string;

  @Column({ length: 100 })
  pais!: string;

  @Column({ length: 100 })
  ciudad!: string;

  @Column('numeric', {
    precision: 10,
    scale: 6,
    nullable: true,
    transformer: numericTransformer,
  })
  latitud?: number;

  @Column('numeric', {
    precision: 10,
    scale: 6,
    nullable: true,
    transformer: numericTransformer,
  })
  longitud?: number;

  @Column({ name: 'imagen_principal', type: 'text', nullable: true })
  imagenPrincipal?: string;

  @Column({ default: true })
  activo!: boolean;

  // search_vector es calculado por un trigger de Postgres (ver Script-26.sql,
  // función destino_search_trigger). No se mapea ni se toca desde la app.

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Tabla puente destino_categoria (sin columnas propias en el schema).
  @ManyToMany(() => Categoria, (categoria) => categoria.destinos)
  @JoinTable({
    name: 'destino_categoria',
    joinColumn: { name: 'destino_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoria_id', referencedColumnName: 'id' },
  })
  categorias?: Categoria[];

  @OneToMany(() => DestinoImagen, (imagen) => imagen.destino)
  imagenes?: DestinoImagen[];
}
