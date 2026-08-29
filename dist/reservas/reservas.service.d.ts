import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Reserva } from './entities/reserva.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { AdminUpdateReservaDto } from './dto/admin-update-reserva.dto';
export declare class ReservasService {
    private readonly reservaRepository;
    private readonly eventEmitter;
    constructor(reservaRepository: Repository<Reserva>, eventEmitter: EventEmitter2);
    create(dto: CreateReservaDto, clienteId?: number): Promise<Reserva>;
    private obtenerDescuentoActivo;
    findAll(): Promise<Reserva[]>;
    findByCliente(clienteId: number): Promise<Reserva[]>;
    findOne(id: number): Promise<Reserva>;
    updateEstado(id: number, dto: UpdateReservaDto): Promise<Reserva>;
    update(id: number, dto: AdminUpdateReservaDto): Promise<Reserva>;
    remove(id: number): Promise<void>;
    cancelarPropia(id: number, clienteId: number): Promise<Reserva>;
}
