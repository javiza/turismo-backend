import { ContenidoService } from './contenido.service';
import { UpdateContenidoHomeDto } from './dto/update-contenido-home.dto';
export declare class ContenidoController {
    private readonly contenidoService;
    constructor(contenidoService: ContenidoService);
    obtener(): Promise<import("./entities/contenido-home.entity").ContenidoHome>;
    actualizar(dto: UpdateContenidoHomeDto): Promise<import("./entities/contenido-home.entity").ContenidoHome>;
}
