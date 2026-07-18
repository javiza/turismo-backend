import {
  IsInt,
  IsPositive,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateReservaDto {
  @IsInt()
  @IsPositive()
  paqueteId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombreCliente!: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  emailCliente?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @IsInt()
  @Min(1)
  cantidadPersonas!: number;
}
