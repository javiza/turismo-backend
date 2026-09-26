import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
export enum UserRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 150,
  })
  nombre!: string;

  @Column({
    unique: true,
    length: 150,
  })
  email!: string;

@Exclude()
@Column()
password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  rol!: UserRole;

  // RUT del miembro del equipo (opcional, nullable). Igual criterio que
  // en Cliente: sirve para que un SUPER_ADMIN pueda ubicar/identificar
  // cuentas internas por RUT además de nombre/email.
  @Column({
    length: 20,
    nullable: true,
  })
  rut?: string;

  @Column({
    default: true,
  })
  activo!: boolean;

 @CreateDateColumn({
  name: 'created_at',
})
createdAt!: Date;

@UpdateDateColumn({
  name: 'updated_at',
})
updatedAt!: Date;

@Exclude()
@Column({
  type: 'text',
  nullable: true,
})
hashedRefreshToken!: string | null;

// "Olvidé mi contraseña": token de un solo uso (hasheado, ver
// common/utils/token-hash.ts) y su expiración. Ambos nulos fuera de una
// solicitud de reseteo en curso. Mismo criterio que Cliente.
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
}