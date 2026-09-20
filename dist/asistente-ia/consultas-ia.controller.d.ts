import { ConsultasIaService } from './consultas-ia.service';
export declare class ConsultasIaController {
    private readonly consultasIaService;
    constructor(consultasIaService: ConsultasIaService);
    findAll(): Promise<import("./entities/consulta-email.entity").ConsultaEmail[]>;
    findEscaladas(): Promise<import("./entities/consulta-email.entity").ConsultaEmail[]>;
}
