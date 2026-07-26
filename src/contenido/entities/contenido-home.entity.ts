import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

/** Una reseña/testimonio de cliente mostrado en la home. */
export interface ResenaHome {
  nombre: string;
  texto: string;
  valoracion?: number;
}

/**
 * Fila única (id siempre = 1) con el contenido editable de la home:
 * título, presentación, misión, visión, valores y reseñas de clientes.
 * Ver migración CreateContenidoHome para la restricción CHECK que impide
 * más de una fila, y AddTituloYResenasAContenidoHome para estas dos
 * columnas agregadas después.
 */
@Entity('contenido_home')
export class ContenidoHome {
  @PrimaryColumn({ default: 1 })
  id!: number;

  // Nombre comercial de la agencia. Vive acá (y no en una variable de
  // entorno) porque el objetivo es que un mismo backend pueda reutilizarse
  // para distintos clientes sin tocar código ni redeploy: el admin de cada
  // cliente lo configura desde su propio panel, y el frontend lo consume
  // desde este mismo endpoint (título de pestaña, navbar, footer, etc.).
@Column('text', { name: 'nombre_agencia', default: 'Tu Agencia de Viajes' })
   nombreAgencia!: string;

  // URL del logo de la agencia (subido a Cloudinary desde el panel admin
  // o pegado como URL externa). Nullable: mientras no haya logo, el
  // frontend cae de vuelta al ícono genérico (ver Navbar/Footer).
  @Column('text', { name: 'logo_url', nullable: true })
  logoUrl!: string | null;

  // Color (hex) de la frase que acompaña al logo (nombreAgencia en
  // Navbar/Footer, con tipografía manuscrita — ver navbar.tsx). Editable
  // por separado del resto del contenido para que el admin pueda ajustar
  // solo esto sin tocar título/reseñas/etc.
  @Column('text', { name: 'slogan_color', default: '#c2410c' })
  sloganColor!: string;

  // Key de la tipografía preseleccionada para el slogan (ver
  // FUENTES_SLOGAN en el frontend: src/lib/slogan-fonts.ts). Se ignora
  // en el render público cuando slogan_font_url está presente.
  @Column('text', { name: 'slogan_font_family', default: 'caveat' })
  sloganFontFamily!: string;

  // URL (Cloudinary, resource_type raw) de una tipografía propia subida
  // por el admin. Nullable: mientras no se suba una, el frontend usa la
  // preseleccionada de sloganFontFamily.
  @Column('text', { name: 'slogan_font_url', nullable: true })
  sloganFontUrl!: string | null;

  @Column('text')
  titulo!: string;

  // Bajada corta que aparece debajo del título en el hero de la home
  // (ej. "Arma tu próximo viaje con destinos, paquetes y ofertas...").
  // Ver migración AddSubtituloAContenidoHome.
  @Column('text', { default: '' })
  subtitulo!: string;

  @Column('text')
  presentacion!: string;

  @Column('text')
  mision!: string;

  @Column('text')
  vision!: string;

  @Column('text')
  valores!: string;

  // Array de testimonios {nombre, texto, valoracion?}. El admin los arma
  // libremente desde el panel, por eso JSONB en vez de tabla relacional.
  @Column('jsonb', { default: () => "'[]'" })
  resenas!: ResenaHome[];

  // Datos de contacto de la agencia que se muestran en el Footer
  // público. Nullable: el Footer omite la línea correspondiente
  // mientras el admin no las cargue.
  @Column('text', { nullable: true })
  telefono!: string | null;

  @Column('text', { nullable: true })
  correo!: string | null;

  @Column('text', { nullable: true })
  direccion!: string | null;

  // Imagen de fondo del hero (home pública) y del banner de la sesión
  // de cliente. Nullable: mientras no se cargue una, el frontend cae de
  // vuelta a la imagen por defecto del proyecto. Se sube por las mismas
  // dos vías que el logo (Cloudinary o URL externa pegada a mano).
  @Column('text', { name: 'hero_imagen_url', nullable: true })
  heroImagenUrl!: string | null;

  // Posición del encuadre en % (0-100), igual a CSS object-position.
  // 50/50 = centrado (comportamiento por defecto de object-cover).
  @Column('float', { name: 'hero_imagen_pos_x', default: 50 })
  heroImagenPosX!: number;

  @Column('float', { name: 'hero_imagen_pos_y', default: 50 })
  heroImagenPosY!: number;

  // Zoom en % (100 = tamaño normal, >100 acerca/recorta una sección de
  // la imagen). Se aplica como transform: scale() sobre la imagen ya
  // posicionada con object-position.
  @Column('float', { name: 'hero_imagen_zoom', default: 100 })
  heroImagenZoom!: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
