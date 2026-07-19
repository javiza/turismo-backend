import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsInt,
  IsEnum,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';
import { EstadoReserva } from '../entities/reserva.entity';

/**
 * DTO para edición completa desde el panel admin. A diferencia de
 * UpdateReservaDto (que solo permite cambiar el estado), este permite
 * corregir los datos de contacto, cantidad de personas, monto y estado
 * de una reserva ya creada. No permite cambiar el paquete asociado: si
 * el paquete es incorrecto, lo correcto es cancelar y crear una nueva.
 */
export class AdminUpdateReservaDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombreCliente?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  emailCliente?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  cantidadPersonas?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  montoTotal?: number;

  @IsOptional()
  @IsEnum(EstadoReserva)
  estado?: EstadoReserva;
}
