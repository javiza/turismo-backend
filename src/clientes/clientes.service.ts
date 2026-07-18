import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { getBcryptRounds } from '../common/utils/bcrypt-rounds';
import { hashToken } from '../common/utils/token-hash';

import { Cliente } from './entities/cliente.entity';
import { RegistroClienteDto } from '../clientes-auth/dto/registro-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async registrar(dto: RegistroClienteDto): Promise<Cliente> {
    const existe = await this.clienteRepository.findOne({
      where: { email: dto.email },
    });

    if (existe) {
      throw new ConflictException('Ya existe una cuenta con ese email');
    }

    const password = await bcrypt.hash(dto.password, getBcryptRounds());

    const cliente = this.clienteRepository.create({
      nombre: dto.nombre,
      email: dto.email,
      telefono: dto.telefono,
      password,
      activo: true,
    });

    return this.clienteRepository.save(cliente);
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    return this.clienteRepository.findOne({ where: { email } });
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({ where: { id } });

    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return cliente;
  }

  async updateRefreshToken(id: number, refreshToken: string): Promise<void> {
    const hashed = hashToken(refreshToken);
    await this.clienteRepository.update(id, { hashedRefreshToken: hashed });
  }

  /** Logout: invalida el refresh token actual. */
  async clearRefreshToken(id: number): Promise<void> {
    await this.clienteRepository.update(id, { hashedRefreshToken: null });
  }

  /** Panel admin: gestión de clientes (requerimiento "gestionar usuarios clientes"). */
  async findAll(): Promise<Cliente[]> {
    return this.clienteRepository.find({ order: { createdAt: 'DESC' } });
  }

  async deactivate(id: number): Promise<Cliente> {
    const cliente = await this.findOne(id);
    cliente.activo = false;
    return this.clienteRepository.save(cliente);
  }

  async reactivate(id: number): Promise<Cliente> {
    const cliente = await this.findOne(id);
    cliente.activo = true;
    return this.clienteRepository.save(cliente);
  }
}
