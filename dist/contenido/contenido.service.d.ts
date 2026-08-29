import { Repository } from 'typeorm';
import { ContenidoHome } from './entities/contenido-home.entity';
import { UpdateContenidoHomeDto } from './dto/update-contenido-home.dto';
export declare class ContenidoService {
    private readonly contenidoRepository;
    constructor(contenidoRepository: Repository<ContenidoHome>);
    obtener(): Promise<ContenidoHome>;
    actualizar(dto: UpdateContenidoHomeDto): Promise<ContenidoHome>;
}
