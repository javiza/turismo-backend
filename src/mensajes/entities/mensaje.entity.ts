import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

/**
 * Mapea la tabla "mensajes" (formulario de contacto público).
 * Antes de este cambio, esta clase era un stub vacío
 * (`export class Mensaje {}`) generado por `nest generate resource`
 * y nunca completado.
 */
@Entity('mensajes')
export class Mensaje {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  nombre!: string;

  @Column({ length: 150 })
  correo!: string;

  @Column({ length: 50, nullable: true })
  telefono?: string;

  @Column({ length: 200, nullable: true })
  asunto?: string;

  @Column('text')
  mensaje!: string;

  @Column({ default: false })
  leido!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
