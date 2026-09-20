import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { RegistroClienteDto } from '../clientes-auth/dto/registro-cliente.dto';
import { UpdateClienteAdminDto } from './dto/update-cliente-admin.dto';
import { UpdatePerfilClienteDto } from '../clientes-auth/dto/update-perfil-cliente.dto';
export declare class ClientesService {
    private readonly clienteRepository;
    constructor(clienteRepository: Repository<Cliente>);
    registrar(dto: RegistroClienteDto): Promise<Cliente>;
    findByEmail(email: string): Promise<Cliente | null>;
    findOne(id: number): Promise<Cliente>;
    updateRefreshToken(id: number, refreshToken: string): Promise<void>;
    clearRefreshToken(id: number): Promise<void>;
    findAll(q?: string): Promise<Cliente[]>;
    deactivate(id: number): Promise<Cliente>;
    actualizar(id: number, dto: UpdateClienteAdminDto | UpdatePerfilClienteDto): Promise<Cliente>;
    reactivate(id: number): Promise<Cliente>;
    cambiarPassword(clienteId: number, passwordActual: string, passwordNueva: string): Promise<void>;
    generarTokenReseteo(email: string): Promise<{
        cliente: Cliente;
        token: string;
    } | null>;
    resetearPasswordConToken(token: string, passwordNueva: string): Promise<void>;
}
