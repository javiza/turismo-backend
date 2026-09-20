import { Repository } from 'typeorm';
import { HomeSlide, TipoSlide } from './entities/home-slide.entity';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { ReordenarSlidesDto } from './dto/reordenar-slides.dto';
import { DestinosService } from '../destinos/destinos.service';
import { PaquetesService } from '../paquetes/paquetes.service';
import { OfertasService } from '../ofertas/ofertas.service';
import { NoticiasService } from '../noticias/noticias.service';
export interface OpcionSlide {
    id: number;
    titulo: string;
    imagen: string | null;
    activo: boolean;
}
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
    paqueteId: number | null;
    servicioVigente: boolean;
}
export declare class SlidesService {
    private readonly slideRepository;
    private readonly destinosService;
    private readonly paquetesService;
    private readonly ofertasService;
    private readonly noticiasService;
    constructor(slideRepository: Repository<HomeSlide>, destinosService: DestinosService, paquetesService: PaquetesService, ofertasService: OfertasService, noticiasService: NoticiasService);
    private validarReferencia;
    private resolver;
    publico(): Promise<SlideResuelto[]>;
    findAllAdmin(): Promise<SlideResuelto[]>;
    opciones(tipo: TipoSlide): Promise<OpcionSlide[]>;
    create(dto: CreateSlideDto): Promise<SlideResuelto>;
    private obtenerEntidad;
    update(id: number, dto: UpdateSlideDto): Promise<SlideResuelto>;
    remove(id: number): Promise<void>;
    reordenar(dto: ReordenarSlidesDto): Promise<SlideResuelto[]>;
}
