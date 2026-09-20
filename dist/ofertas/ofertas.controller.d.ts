import { OfertasService } from './ofertas.service';
import { CreateOfertaDto } from './dto/create-oferta.dto';
import { UpdateOfertaDto } from './dto/update-oferta.dto';
import { AgregarImagenDto } from '../common/dto/agregar-imagen.dto';
export declare class OfertasController {
    private readonly ofertasService;
    constructor(ofertasService: OfertasService);
    findAll(): Promise<import("./entities/oferta.entity").Oferta[]>;
    findAllAdmin(): Promise<import("./entities/oferta.entity").Oferta[]>;
    findOne(id: string): Promise<import("./entities/oferta.entity").Oferta>;
    create(dto: CreateOfertaDto): Promise<import("./entities/oferta.entity").Oferta>;
    update(id: string, dto: UpdateOfertaDto): Promise<import("./entities/oferta.entity").Oferta>;
    remove(id: string): Promise<void>;
    agregarImagen(id: string, dto: AgregarImagenDto): Promise<import("./entities/oferta-imagen.entity").OfertaImagen>;
    eliminarImagen(id: string, imagenId: string): Promise<void>;
    marcarImagenPrincipal(id: string, imagenId: string): Promise<import("./entities/oferta-imagen.entity").OfertaImagen>;
}
