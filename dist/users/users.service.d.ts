import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(dto: CreateUserDto): Promise<User>;
    findAll(q?: string): Promise<User[]>;
    findOne(id: number): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    deactivate(id: number): Promise<User>;
    reactivate(id: number): Promise<User>;
    updateRefreshToken(userId: number, refreshToken: string): Promise<void>;
    clearRefreshToken(userId: number): Promise<void>;
    cambiarPassword(userId: number, passwordActual: string, passwordNueva: string): Promise<void>;
}
