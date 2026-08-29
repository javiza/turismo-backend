import { Repository } from 'typeorm';
import { GmailService } from './gmail.service';
import { IaService } from './ia.service';
import { ConsultaEmail } from './entities/consulta-email.entity';
import { Paquete } from '../paquetes/entities/paquete.entity';
import { Oferta } from '../ofertas/entities/oferta.entity';
import { EmailService } from '../email/email.service';
export declare class ConsultasIaService {
    private readonly gmailService;
    private readonly iaService;
    private readonly emailService;
    private readonly consultaRepository;
    private readonly paqueteRepository;
    private readonly ofertaRepository;
    private readonly logger;
    constructor(gmailService: GmailService, iaService: IaService, emailService: EmailService, consultaRepository: Repository<ConsultaEmail>, paqueteRepository: Repository<Paquete>, ofertaRepository: Repository<Oferta>);
    revisarBandejaEntrada(): Promise<void>;
    private procesarCorreo;
    private obtenerContextoCatalogo;
    findEscaladas(): Promise<ConsultaEmail[]>;
    findAll(): Promise<ConsultaEmail[]>;
}
