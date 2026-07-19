import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Destino } from '../../destinos/entities/destino.entity';
import { numericTransformer } from '../../common/transformers/numeric.transformer';
import { PaqueteImagen } from './paquete-imagen.entity';

@Entity('paquetes')
export class Paquete {
  @PrimaryGeneratedColumn()
  id!: number;

  // Columna que refleja destino_id, para poder leer el id sin tener que
  // cargar siempre la relación completa. IMPORTANTE: NO marcar esta columna
  // con insert:false/update:false — TypeORM reutiliza esta misma
  // ColumnMetadata como la columna de join de la relación `destino` de
  // abajo (son la misma columna física, no dos mapeos distintos), así que
  // insert:false aquí deshabilita la escritura de destino_id sea cual sea
  // la vía usada (relación u objeto plano), y la fila queda con
  // destino_id NULL pese a llegar un valor válido desde el DTO.
  @Column({ name: 'destino_id' })
  destinoId!: number;

  @ManyToOne(() => Destino, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn({ name: 'destino_id' })
  destino!: Destino;

  @Column({ length: 200 })
  nombre!: string;

  @Column('text')
  descripcion!: string;

  @Column('numeric', {
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  precio!: number;

  // Se completa solo desde PaquetesService.update() cuando el admin baja
  // el precio: guarda el valor anterior para poder mostrarlo tachado en
  // la vitrina pública (como una rebaja comercial). Null = no hay rebaja
  // vigente que mostrar. El admin puede limpiarlo a mano.
  @Column('numeric', {
    name: 'precio_anterior',
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: numericTransformer,
  })
  precioAnterior?: number;

  @Column('int')
  cupos!: number;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio!: string;

  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin!: string;

  @Column({ default: true })
  activo!: boolean;

  // Denormalizado a propósito: guarda la url de la imagen marcada como
  // "es_principal" en la galería (paquete_imagenes), para poder mostrarla
  // en cards/listados sin tener que traer siempre la relación completa.
  // La mantiene sincronizada PaquetesService (agregarImagen/marcarPrincipal/
  // eliminarImagen).
  @Column({ name: 'imagen_principal', type: 'text', nullable: true })
  imagenPrincipal?: string;

  @OneToMany(() => PaqueteImagen, (imagen) => imagen.paquete)
  imagenes?: PaqueteImagen[];

  // search_vector: se calcula automáticamente por el trigger
  // paquete_search_trigger (ver sql/002-paquete-search-trigger.sql).
  // Antes de aplicar ese script, esta columna quedaba siempre en NULL.
  // No se mapea como columna editable: solo Postgres la escribe.

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
