import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { EmailService } from '../email/email.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
export declare class ProveedoresService {
    private readonly proveedorRepository;
    private readonly emailService;
    private readonly whatsappService;
    constructor(proveedorRepository: Repository<Proveedor>, emailService: EmailService, whatsappService: WhatsappService);
    create(dto: CreateProveedorDto): Promise<Proveedor>;
    findAll(): Promise<Proveedor[]>;
    findOne(id: number): Promise<Proveedor>;
    update(id: number, dto: UpdateProveedorDto): Promise<Proveedor>;
    remove(id: number): Promise<void>;
    contarNoLeidos(): Promise<{
        count: number;
    }>;
}
