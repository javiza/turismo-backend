import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

/** Una reseña/testimonio de cliente mostrado en la home. */
export interface ResenaHome {
  nombre: string;
  texto: string;
  valoracion?: number;
}

/**
 * Fila única (id siempre = 1) con el contenido editable de la home:
 * título, presentación, misión, visión, valores y reseñas de clientes.
 * Ver migración CreateContenidoHome para la restricción CHECK que impide
 * más de una fila, y AddTituloYResenasAContenidoHome para estas dos
 * columnas agregadas después.
 */
@Entity('contenido_home')
export class ContenidoHome {
  @PrimaryColumn({ default: 1 })
  id!: number;

  @Column('text')
  titulo!: string;

  @Column('text')
  presentacion!: string;

  @Column('text')
  mision!: string;

  @Column('text')
  vision!: string;

  @Column('text')
  valores!: string;

  // Array de testimonios {nombre, texto, valoracion?}. El admin los arma
  // libremente desde el panel, por eso JSONB en vez de tabla relacional.
  @Column('jsonb', { default: () => "'[]'" })
  resenas!: ResenaHome[];

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
