import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

/**
 * Usuario final de la agencia (quien reserva/cotiza), separado por
 * completo de `User` (el admin del panel). Sesiones, secrets JWT y guards
 * son independientes a propósito: un token de cliente nunca debe poder
 * usarse en un endpoint de admin, ni viceversa, aunque alguien intente
 * mezclar los headers.
 */
@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  nombre!: string;

  @Column({ unique: true, length: 150 })
  email!: string;

  @Exclude()
  @Column()
  password!: string;

  @Column({ length: 50, nullable: true })
  telefono?: string;

  @Column({ default: true })
  activo!: boolean;

  @Exclude()
  @Column({ name: 'hashed_refresh_token', type: 'text', nullable: true })
  hashedRefreshToken!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
