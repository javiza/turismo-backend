import { ClientesService } from './clientes.service';
import { UpdateClienteAdminDto } from './dto/update-cliente-admin.dto';
export declare class ClientesController {
    private readonly clientesService;
    constructor(clientesService: ClientesService);
    findAll(q?: string): Promise<import("./entities/cliente.entity").Cliente[]>;
    findOne(id: string): Promise<import("./entities/cliente.entity").Cliente>;
    actualizar(id: string, dto: UpdateClienteAdminDto): Promise<import("./entities/cliente.entity").Cliente>;
    deactivate(id: string): Promise<import("./entities/cliente.entity").Cliente>;
    reactivate(id: string): Promise<import("./entities/cliente.entity").Cliente>;
}
