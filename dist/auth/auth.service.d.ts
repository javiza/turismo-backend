import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly config;
    private readonly emailService;
    constructor(usersService: UsersService, jwtService: JwtService, config: ConfigService, emailService: EmailService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(userId: number): Promise<void>;
    profile(userId: number): Promise<User>;
    cambiarPassword(userId: number, passwordActual: string, passwordNueva: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, passwordNueva: string): Promise<{
        message: string;
    }>;
    private getTokens;
}
