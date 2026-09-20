import { DestinosService } from './destinos.service';
import { CreateDestinoDto } from './dto/create-destino.dto';
import { UpdateDestinoDto } from './dto/update-destino.dto';
import { AgregarImagenDto } from '../common/dto/agregar-imagen.dto';
export declare class DestinosController {
    private readonly destinosService;
    constructor(destinosService: DestinosService);
    findAll(): Promise<import("./entities/destino.entity").Destino[]>;
    buscar(q: string): Promise<import("./entities/destino.entity").Destino[]>;
    findAllAdmin(): Promise<import("./entities/destino.entity").Destino[]>;
    findOne(id: string): Promise<import("./entities/destino.entity").Destino>;
    create(dto: CreateDestinoDto): Promise<import("./entities/destino.entity").Destino>;
    update(id: string, dto: UpdateDestinoDto): Promise<import("./entities/destino.entity").Destino>;
    remove(id: string): Promise<void>;
    agregarImagen(id: string, dto: AgregarImagenDto): Promise<import("./entities/destino-imagen.entity").DestinoImagen>;
    eliminarImagen(id: string, imagenId: string): Promise<void>;
    marcarImagenPrincipal(id: string, imagenId: string): Promise<import("./entities/destino-imagen.entity").DestinoImagen>;
    agregarCategoria(id: string, categoriaId: string): Promise<import("./entities/destino.entity").Destino>;
    quitarCategoria(id: string, categoriaId: string): Promise<import("./entities/destino.entity").Destino>;
}
