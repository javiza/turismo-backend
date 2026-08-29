import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CambiarPasswordDto } from '../common/dto/cambiar-password.dto';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(user: JwtPayload): Promise<{
        message: string;
    }>;
    profile(user: JwtPayload): Promise<import("../users/entities/user.entity").User>;
    cambiarPassword(dto: CambiarPasswordDto, user: JwtPayload): Promise<{
        message: string;
    }>;
}
