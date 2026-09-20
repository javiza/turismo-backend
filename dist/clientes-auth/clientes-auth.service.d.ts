import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientesService } from '../clientes/clientes.service';
import { Cliente } from '../clientes/entities/cliente.entity';
import { RegistroClienteDto } from './dto/registro-cliente.dto';
import { UpdatePerfilClienteDto } from './dto/update-perfil-cliente.dto';
import { LoginClienteDto } from './dto/login-cliente.dto';
import { RefreshTokenClienteDto } from './dto/refresh-token-cliente.dto';
import { ReservasService } from '../reservas/reservas.service';
import { CotizacionesService } from '../cotizaciones/cotizaciones.service';
import { EmailService } from '../email/email.service';
export declare class ClientesAuthService {
    private readonly clientesService;
    private readonly jwtService;
    private readonly config;
    private readonly reservasService;
    private readonly cotizacionesService;
    private readonly emailService;
    constructor(clientesService: ClientesService, jwtService: JwtService, config: ConfigService, reservasService: ReservasService, cotizacionesService: CotizacionesService, emailService: EmailService);
    registro(dto: RegistroClienteDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    login(dto: LoginClienteDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refresh(dto: RefreshTokenClienteDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(clienteId: number): Promise<void>;
    perfil(clienteId: number): Promise<Cliente>;
    actualizarPerfil(clienteId: number, dto: UpdatePerfilClienteDto): Promise<Cliente>;
    cambiarPassword(clienteId: number, passwordActual: string, passwordNueva: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, passwordNueva: string): Promise<{
        message: string;
    }>;
    misReservas(clienteId: number): Promise<import("../reservas/entities/reserva.entity").Reserva[]>;
    cancelarReserva(reservaId: number, clienteId: number): Promise<import("../reservas/entities/reserva.entity").Reserva>;
    misCotizaciones(clienteId: number): Promise<import("../cotizaciones/entities/cotizacion.entity").Cotizacion[]>;
    private getTokens;
}
