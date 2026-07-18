import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum AccionAuditoria {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

/** Bitácora de cambios sobre las entidades de negocio principales. */
@Entity('auditoria')
export class Auditoria {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  tabla!: string;

  @Column({ type: 'varchar', length: 50 })
  accion!: AccionAuditoria;

  @Column({ name: 'registro_id', type: 'bigint', nullable: true })
  registroId?: number;

  @Column({ name: 'usuario_id', type: 'bigint', nullable: true })
  usuarioId?: number;

  @Column('jsonb', { name: 'datos_anteriores', nullable: true })
  datosAnteriores?: Record<string, unknown>;

  @Column('jsonb', { name: 'datos_nuevos', nullable: true })
  datosNuevos?: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
