import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum EstadoConsultaEmail {
  RESPONDIDA_IA = 'RESPONDIDA_IA',
  ESCALADA = 'ESCALADA',
  ERROR = 'ERROR',
}

/**
 * Registro de cada correo entrante a la casilla de Gmail que el asistente
 * IA procesó. Existe por dos razones:
 *
 * 1. Idempotencia: el cron revisa la bandeja periódicamente, y usamos
 *    `gmailMessageId` (unique) para no procesar/responder el mismo correo
 *    dos veces si el cron se solapa o Gmail repite el mensaje en el listado.
 * 2. Auditoría: quien administra la agencia necesita poder ver qué
 *    contestó la IA en su nombre, y qué quedó escalado a un humano.
 */
@Entity('consultas_email')
export class ConsultaEmail {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'gmail_message_id', unique: true, length: 100 })
  gmailMessageId!: string;

  @Column({ name: 'gmail_thread_id', length: 100 })
  gmailThreadId!: string;

  @Column({ length: 200 })
  remitente!: string;

  @Column({ length: 250, nullable: true })
  asunto?: string;

  @Column('text', { name: 'cuerpo_original' })
  cuerpoOriginal!: string;

  @Column('text', { nullable: true })
  respuesta?: string;

  @Column({
    type: 'enum',
    enum: EstadoConsultaEmail,
  })
  estado!: EstadoConsultaEmail;

  // Motivo de escalamiento o del error, para revisión rápida en el panel
  // admin sin tener que leer el cuerpo completo del correo.
  @Column('text', { nullable: true })
  detalle?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
