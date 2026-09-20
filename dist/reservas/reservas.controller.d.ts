import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { AdminUpdateReservaDto } from './dto/admin-update-reserva.dto';
import type { JwtClientePayload } from '../clientes-auth/interfaces/jwt-cliente-payload.interface';
export declare class ReservasController {
    private readonly reservasService;
    constructor(reservasService: ReservasService);
    create(dto: CreateReservaDto, cliente?: JwtClientePayload): Promise<import("./entities/reserva.entity").Reserva>;
    findAll(): Promise<import("./entities/reserva.entity").Reserva[]>;
    findOne(id: string): Promise<import("./entities/reserva.entity").Reserva>;
    updateEstado(id: string, dto: UpdateReservaDto): Promise<import("./entities/reserva.entity").Reserva>;
    update(id: string, dto: AdminUpdateReservaDto): Promise<import("./entities/reserva.entity").Reserva>;
    remove(id: string): Promise<void>;
}
