import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegistroClienteDto {
  @IsString()
  @MaxLength(150)
  nombre!: string;

  @IsEmail()
  @MaxLength(150)
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;
}
