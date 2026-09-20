import { SlidesService } from './slides.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { ReordenarSlidesDto } from './dto/reordenar-slides.dto';
import { TipoSlide } from './entities/home-slide.entity';
export declare class SlidesController {
    private readonly slidesService;
    constructor(slidesService: SlidesService);
    publico(): Promise<import("./slides.service").SlideResuelto[]>;
    findAllAdmin(): Promise<import("./slides.service").SlideResuelto[]>;
    opciones(tipo: TipoSlide): Promise<import("./slides.service").OpcionSlide[]>;
    create(dto: CreateSlideDto): Promise<import("./slides.service").SlideResuelto>;
    reordenar(dto: ReordenarSlidesDto): Promise<import("./slides.service").SlideResuelto[]>;
    update(id: number, dto: UpdateSlideDto): Promise<import("./slides.service").SlideResuelto>;
    remove(id: number): Promise<void>;
}
