import { TipoSlide } from '../entities/home-slide.entity';
export declare class CreateSlideDto {
    tipo: TipoSlide;
    referenciaId: number;
    orden?: number;
    activo?: boolean;
}
