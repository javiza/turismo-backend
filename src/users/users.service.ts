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

import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    dto: CreateUserDto,
  ): Promise<User> {
    const exists =
      await this.userRepository.findOne({
        where: {
          email: dto.email,
        },
      });

    if (exists) {
      throw new ConflictException(
        'Email ya registrado',
      );
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      getBcryptRounds(),
    );

    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    return await this.userRepository.save(
      user,
    );
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(
    id: number,
  ): Promise<User> {
    const user =
      await this.userRepository.findOne({
        where: { id },
      });

    if (!user) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    return user;
  }

  async findByEmail(
    email: string,
  ): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }
  async deactivate(
  id: number,
) {
  const user =
    await this.findOne(id);

  user.activo = false;

  return this.userRepository.save(
    user,
  );
}
async updateRefreshToken(
  userId: number,
  refreshToken: string,
): Promise<void> {
  const hashed = hashToken(refreshToken);

  await this.userRepository.update(userId, {
    hashedRefreshToken: hashed,
  });
}

/** Logout: invalida el refresh token actual. Cualquier intento de refresh posterior con el viejo token va a fallar la comparación en AuthService.refresh(). */
async clearRefreshToken(userId: number): Promise<void> {
  await this.userRepository.update(userId, {
    hashedRefreshToken: null,
  });
}

}