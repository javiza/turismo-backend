import { ClientesAuthService } from './clientes-auth.service';
import { RegistroClienteDto } from './dto/registro-cliente.dto';
import { UpdatePerfilClienteDto } from './dto/update-perfil-cliente.dto';
import { LoginClienteDto } from './dto/login-cliente.dto';
import { RefreshTokenClienteDto } from './dto/refresh-token-cliente.dto';
import { CambiarPasswordDto } from '../common/dto/cambiar-password.dto';
import { ForgotPasswordClienteDto } from './dto/forgot-password-cliente.dto';
import { ResetPasswordClienteDto } from './dto/reset-password-cliente.dto';
import type { JwtClientePayload } from './interfaces/jwt-cliente-payload.interface';
export declare class ClientesAuthController {
    private readonly clientesAuthService;
    constructor(clientesAuthService: ClientesAuthService);
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
    logout(cliente: JwtClientePayload): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordClienteDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordClienteDto): Promise<{
        message: string;
    }>;
    perfil(cliente: JwtClientePayload): Promise<import("../clientes/entities/cliente.entity").Cliente>;
    actualizarPerfil(dto: UpdatePerfilClienteDto, cliente: JwtClientePayload): Promise<import("../clientes/entities/cliente.entity").Cliente>;
    cambiarPassword(dto: CambiarPasswordDto, cliente: JwtClientePayload): Promise<{
        message: string;
    }>;
    misReservas(cliente: JwtClientePayload): Promise<import("../reservas/entities/reserva.entity").Reserva[]>;
    misCotizaciones(cliente: JwtClientePayload): Promise<import("../cotizaciones/entities/cotizacion.entity").Cotizacion[]>;
    cancelarReserva(id: string, cliente: JwtClientePayload): Promise<import("../reservas/entities/reserva.entity").Reserva>;
}
