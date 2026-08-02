import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Tipo de servicio al que apunta un slide. No usamos una FK real porque
 * cada tipo referencia una tabla distinta (destinos/paquetes/ofertas/
 * noticias) — la integridad se valida a mano en SlidesService (el
 * servicio dueño de cada tipo debe encontrar el registro antes de
 * guardar) en vez de en la base de datos.
 */
export enum TipoSlide {
  DESTINO = 'destino',
  PAQUETE = 'paquete',
  OFERTA = 'oferta',
  NOTICIA = 'noticia',
}

/**
 * Configuración del slide/carrusel destacado que ve el cliente logueado
 * apenas entra a su dashboard (sección "Inicio"). Cada fila es una
 * "vitrina" que el admin arma eligiendo un servicio ya existente
 * (destino, paquete, oferta o noticia) — el slide siempre muestra la
 * info vigente de ese servicio (precio, fechas, descripción, imagen),
 * nunca una copia, así que si el admin edita el destino después, el
 * slide se actualiza solo. Ver SlidesService.resolver().
 */
@Entity('home_slides')
export class HomeSlide {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: TipoSlide })
  tipo!: TipoSlide;

  @Column({ name: 'referencia_id' })
  referenciaId!: number;

  // Orden de aparición en el slider (ascendente). El admin lo ajusta
  // arrastrando o con flechas en el panel; ver SlidesService.reordenar.
  @Column('int', { default: 0 })
  orden!: number;

  // Permite sacar un slide de circulación sin borrarlo (ej. mientras se
  // termina de cargar el servicio, o para pausarlo temporalmente).
  @Column({ default: true })
  activo!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
