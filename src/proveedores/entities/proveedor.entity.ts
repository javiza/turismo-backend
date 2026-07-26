import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

/**
 * Mapea la tabla "proveedores": formulario público "Contacto proveedores"
 * (home -> /proveedores). Un negocio o posible proveedor deja sus datos
 * de contacto para que la agencia lo evalúe y lo contacte después. Ver
 * ProveedoresService.create() para el aviso al admin por correo y por
 * WhatsApp que dispara cada registro nuevo.
 */
@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nombre_negocio', length: 150 })
  nombreNegocio!: string;

  @Column({ length: 150, nullable: true })
  rubro?: string;

  @Column({ name: 'nombre_contacto', length: 150 })
  nombreContacto!: string;

  @Column({ length: 150 })
  correo!: string;

  @Column({ length: 50 })
  telefono!: string;

  @Column({ length: 200, nullable: true })
  direccion?: string;

  @Column('text')
  descripcion!: string;

  @Column({ default: false })
  leido!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
