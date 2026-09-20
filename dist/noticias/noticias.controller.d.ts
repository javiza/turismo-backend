import { NoticiasService } from './noticias.service';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class NoticiasController {
    private readonly noticiasService;
    constructor(noticiasService: NoticiasService);
    findAll(): Promise<import("./entities/noticia.entity").Noticia[]>;
    findAllAdmin(): Promise<import("./entities/noticia.entity").Noticia[]>;
    findOne(id: string): Promise<import("./entities/noticia.entity").Noticia>;
    create(dto: CreateNoticiaDto, user: JwtPayload): Promise<import("./entities/noticia.entity").Noticia>;
    update(id: string, dto: UpdateNoticiaDto): Promise<import("./entities/noticia.entity").Noticia>;
    remove(id: string): Promise<void>;
}
