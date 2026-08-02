import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HomeSlide, TipoSlide } from './entities/home-slide.entity';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { ReordenarSlidesDto } from './dto/reordenar-slides.dto';
import { DestinosService } from '../destinos/destinos.service';
import { PaquetesService } from '../paquetes/paquetes.service';
import { OfertasService } from '../ofertas/ofertas.service';
import { NoticiasService } from '../noticias/noticias.service';

/** Vista de "opción elegible" para el selector del panel admin. */
export interface OpcionSlide {
  id: number;
  titulo: string;
  imagen: string | null;
  activo: boolean;
}

/** Slide con los datos vigentes del servicio ya resueltos, listo para pintar. */
export interface SlideResuelto {
  id: number;
  tipo: TipoSlide;
  referenciaId: number;
  orden: number;
  activo: boolean;
  titulo: string;
  descripcion: string;
  imagen: string | null;
  precio: number | null;
  precioAnterior: number | null;
  descuento: number | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  // Solo presente en slides de tipo "oferta": id del paquete que la
  // sustenta, para poder reservar/consultar sobre él directamente desde
  // el modal de detalle del slide (ver OfertaAcciones en el frontend).
  paqueteId: number | null;
  // El servicio referenciado sigue existiendo y activo. Un slide con
  // servicioVigente=false es "huérfano" (el destino/paquete/etc. se
  // desactivó o se borró) y el endpoint público lo omite directamente.
  servicioVigente: boolean;
}

@Injectable()
export class SlidesService {
  constructor(
    @InjectRepository(HomeSlide)
    private readonly slideRepository: Repository<HomeSlide>,
    private readonly destinosService: DestinosService,
    private readonly paquetesService: PaquetesService,
    private readonly ofertasService: OfertasService,
    private readonly noticiasService: NoticiasService,
  ) {}

  /**
   * Valida que exista el servicio elegido antes de guardar el slide
   * (evita crear un slide "roto" apuntando a un id inexistente).
   */
  private async validarReferencia(
    tipo: TipoSlide,
    referenciaId: number,
  ): Promise<void> {
    try {
      switch (tipo) {
        case TipoSlide.DESTINO:
          await this.destinosService.findOne(referenciaId);
          return;
        case TipoSlide.PAQUETE:
          await this.paquetesService.findOne(referenciaId);
          return;
        case TipoSlide.OFERTA:
          await this.ofertasService.findOne(referenciaId);
          return;
        case TipoSlide.NOTICIA:
          await this.noticiasService.findOne(referenciaId);
          return;
      }
    } catch {
      throw new BadRequestException(
        `No se encontró un ${tipo} con id ${referenciaId} para usar en el slide`,
      );
    }
  }

  /** Resuelve un slide a su forma "pintable", trayendo los datos vigentes del servicio. */
  private async resolver(slide: HomeSlide): Promise<SlideResuelto> {
    const base = {
      id: slide.id,
      tipo: slide.tipo,
      referenciaId: slide.referenciaId,
      orden: slide.orden,
      activo: slide.activo,
    };

    try {
      switch (slide.tipo) {
        case TipoSlide.DESTINO: {
          const d = await this.destinosService.findOne(slide.referenciaId);
          return {
            ...base,
            titulo: d.nombre,
            descripcion: d.descripcion,
            imagen: d.imagenPrincipal ?? null,
            precio: d.precioDesde ?? null,
            precioAnterior: null,
            descuento: null,
            fechaInicio: d.fechaInicio ?? null,
            fechaFin: d.fechaFin ?? null,
            paqueteId: null,
            servicioVigente: d.activo,
          };
        }
        case TipoSlide.PAQUETE: {
          const p = await this.paquetesService.findOne(slide.referenciaId);
          return {
            ...base,
            titulo: p.nombre,
            descripcion: p.descripcion,
            imagen: p.imagenPrincipal ?? null,
            precio: p.precio,
            precioAnterior: p.precioAnterior ?? null,
            descuento: null,
            fechaInicio: p.fechaInicio,
            fechaFin: p.fechaFin,
            paqueteId: p.id,
            servicioVigente: p.activo,
          };
        }
        case TipoSlide.OFERTA: {
          const o = await this.ofertasService.findOne(slide.referenciaId);
          return {
            ...base,
            titulo: o.titulo,
            descripcion: o.descripcion ?? '',
            imagen: o.imagenPrincipal ?? o.paquete?.imagenPrincipal ?? null,
            precio: o.paquete?.precio ?? null,
            precioAnterior: null,
            descuento: o.descuento,
            fechaInicio: o.fechaInicio,
            fechaFin: o.fechaFin,
            paqueteId: o.paqueteId,
            servicioVigente: o.activa,
          };
        }
        case TipoSlide.NOTICIA: {
          const n = await this.noticiasService.findOne(slide.referenciaId);
          return {
            ...base,
            titulo: n.titulo,
            descripcion: n.contenido,
            imagen: n.imagenUrl ?? null,
            precio: null,
            precioAnterior: null,
            descuento: null,
            fechaInicio: null,
            fechaFin: null,
            paqueteId: null,
            servicioVigente: n.activa,
          };
        }
      }
    } catch {
      // El servicio referenciado fue borrado (ej. destino eliminado).
      return {
        ...base,
        titulo: '(servicio eliminado)',
        descripcion: '',
        imagen: null,
        precio: null,
        precioAnterior: null,
        descuento: null,
        fechaInicio: null,
        fechaFin: null,
        paqueteId: null,
        servicioVigente: false,
      };
    }
  }

  // --- Lectura pública: la usa el slide de la home del cliente ---
  async publico(): Promise<SlideResuelto[]> {
    const slides = await this.slideRepository.find({
      where: { activo: true },
      order: { orden: 'ASC', id: 'ASC' },
    });
    const resueltos = await Promise.all(slides.map((s) => this.resolver(s)));
    return resueltos.filter((s) => s.servicioVigente);
  }

  // --- Panel admin ---

  async findAllAdmin(): Promise<SlideResuelto[]> {
    const slides = await this.slideRepository.find({
      order: { orden: 'ASC', id: 'ASC' },
    });
    return Promise.all(slides.map((s) => this.resolver(s)));
  }

  /** Ítems elegibles de un tipo dado, para el selector del formulario "Agregar al slide". */
  async opciones(tipo: TipoSlide): Promise<OpcionSlide[]> {
    switch (tipo) {
      case TipoSlide.DESTINO: {
        const items = await this.destinosService.findAllAdmin();
        return items.map((d) => ({
          id: d.id,
          titulo: `${d.nombre} — ${d.ciudad}, ${d.pais}`,
          imagen: d.imagenPrincipal ?? null,
          activo: d.activo,
        }));
      }
      case TipoSlide.PAQUETE: {
        const items = await this.paquetesService.findAllAdmin();
        return items.map((p) => ({
          id: p.id,
          titulo: p.nombre,
          imagen: p.imagenPrincipal ?? null,
          activo: p.activo,
        }));
      }
      case TipoSlide.OFERTA: {
        const items = await this.ofertasService.findAllAdmin();
        return items.map((o) => ({
          id: o.id,
          titulo: o.titulo,
          imagen: o.imagenPrincipal ?? null,
          activo: o.activa,
        }));
      }
      case TipoSlide.NOTICIA: {
        const items = await this.noticiasService.findAllAdmin();
        return items.map((n) => ({
          id: n.id,
          titulo: n.titulo,
          imagen: n.imagenUrl ?? null,
          activo: n.activa,
        }));
      }
    }
  }

  async create(dto: CreateSlideDto): Promise<SlideResuelto> {
    await this.validarReferencia(dto.tipo, dto.referenciaId);

    const maxOrden = await this.slideRepository.maximum('orden');
    const slide = this.slideRepository.create({
      tipo: dto.tipo,
      referenciaId: dto.referenciaId,
      orden: dto.orden ?? (maxOrden ?? -1) + 1,
      activo: dto.activo ?? true,
    });
    const guardado = await this.slideRepository.save(slide);
    return this.resolver(guardado);
  }

  private async obtenerEntidad(id: number): Promise<HomeSlide> {
    const slide = await this.slideRepository.findOne({ where: { id } });
    if (!slide) {
      throw new NotFoundException('Slide no encontrado');
    }
    return slide;
  }

  async update(id: number, dto: UpdateSlideDto): Promise<SlideResuelto> {
    const slide = await this.obtenerEntidad(id);
    Object.assign(slide, dto);
    const guardado = await this.slideRepository.save(slide);
    return this.resolver(guardado);
  }

  async remove(id: number): Promise<void> {
    const slide = await this.obtenerEntidad(id);
    await this.slideRepository.remove(slide);
  }

  /** Reordena todos los slides según el arreglo de ids recibido (0..n-1). */
  async reordenar(dto: ReordenarSlidesDto): Promise<SlideResuelto[]> {
    await Promise.all(
      dto.ids.map((id, indice) =>
        this.slideRepository.update({ id }, { orden: indice }),
      ),
    );
    return this.findAllAdmin();
  }
}
