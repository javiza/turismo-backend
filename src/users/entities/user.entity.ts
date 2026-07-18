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
}