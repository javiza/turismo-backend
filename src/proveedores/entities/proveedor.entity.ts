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

  @Column({ name: 'imagen_url', type: 'text', nullable: true })
  imagenUrl?: string;

  // Precio referencial opcional que el proveedor puede dejar para que el
  // admin tenga una idea de rango de precios antes de contactarlo.
  @Column({
    name: 'precio_referencial',
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  precioReferencial?: number;

  @Column({ default: false })
  leido!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
