import { MensajesService } from './mensajes.service';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { UpdateMensajeDto } from './dto/update-mensaje.dto';
export declare class MensajesController {
    private readonly mensajesService;
    constructor(mensajesService: MensajesService);
    create(dto: CreateMensajeDto): Promise<import("./entities/mensaje.entity").Mensaje>;
    findAll(): Promise<import("./entities/mensaje.entity").Mensaje[]>;
    findOne(id: string): Promise<import("./entities/mensaje.entity").Mensaje>;
    update(id: string, dto: UpdateMensajeDto): Promise<import("./entities/mensaje.entity").Mensaje>;
    remove(id: string): Promise<void>;
}
