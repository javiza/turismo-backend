import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    findAll(q?: string): Promise<import("./entities/user.entity").User[]>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    deactivate(id: string): Promise<import("./entities/user.entity").User>;
    reactivate(id: string): Promise<import("./entities/user.entity").User>;
}
