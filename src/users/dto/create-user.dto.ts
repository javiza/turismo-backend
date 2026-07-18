import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  nombre!: string;

  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsEnum(UserRole)
  rol?: UserRole;
}