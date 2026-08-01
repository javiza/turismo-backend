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

  // RUT chileno (con o sin puntos/guión, tal como lo escriba el admin o
  // el propio cliente). Nullable porque el registro no lo pide todavía;
  // se completa después desde el panel admin o el perfil del cliente.
  // Sirve principalmente para que el admin pueda buscar/identificar
  // clientes por RUT (ver ClientesService.findAll).
  @Column({ length: 20, nullable: true })
  rut?: string;

  @Column({ default: true })
  activo!: boolean;

  @Exclude()
  @Column({ name: 'hashed_refresh_token', type: 'text', nullable: true })
  hashedRefreshToken!: string | null;

  // "Olvidé mi contraseña": token de un solo uso (hasheado, ver
  // common/utils/token-hash.ts) y su expiración. Ambos nulos fuera de una
  // solicitud de reseteo en curso.
  @Exclude()
  @Column({
    name: 'reset_password_token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  resetPasswordToken!: string | null;

  @Exclude()
  @Column({ name: 'reset_password_expires', type: 'timestamp', nullable: true })
  resetPasswordExpires!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
