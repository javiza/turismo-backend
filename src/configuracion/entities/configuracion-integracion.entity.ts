import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ClaveIntegracion {
  SMTP = 'smtp',
  WHATSAPP = 'whatsapp',
  TRANSBANK = 'transbank',
  MERCADOPAGO = 'mercadopago',
}

/**
 * Una fila por integración (smtp, whatsapp, transbank, mercadopago). El
 * contenido real (host, tokens, api keys, etc.) va como JSON cifrado en
 * `valorCifrado` — ver common/utils/crypto.util.ts. Nunca se guarda nada
 * sensible en texto plano acá.
 */
@Entity('configuraciones_integracion')
export class ConfiguracionIntegracion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: ClaveIntegracion, unique: true })
  clave!: ClaveIntegracion;

  @Column({ name: 'valor_cifrado', type: 'text' })
  valorCifrado!: string;

  @Column({ name: 'actualizado_por_id', nullable: true })
  actualizadoPorId?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
