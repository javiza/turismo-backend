import { Repository } from 'typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { UpdateMensajeDto } from './dto/update-mensaje.dto';
import { EmailService } from '../email/email.service';
export declare class MensajesService {
    private readonly mensajeRepository;
    private readonly emailService;
    constructor(mensajeRepository: Repository<Mensaje>, emailService: EmailService);
    create(dto: CreateMensajeDto): Promise<Mensaje>;
    findAll(): Promise<Mensaje[]>;
    findOne(id: number): Promise<Mensaje>;
    update(id: number, dto: UpdateMensajeDto): Promise<Mensaje>;
    remove(id: number): Promise<void>;
}
