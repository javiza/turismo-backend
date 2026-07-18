import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateMensajeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre!: string;

  @IsEmail()
  @MaxLength(150)
  correo!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  asunto?: string;

  @IsString()
  @IsNotEmpty()
  mensaje!: string;
}
