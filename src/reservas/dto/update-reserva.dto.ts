import { IsEnum } from 'class-validator';
import { EstadoReserva } from '../entities/reserva.entity';

/**
 * A propósito NO es un PartialType(CreateReservaDto): cambiar la cantidad
 * de personas o el paquete de una reserva ya creada implicaría re-validar
 * cupos y montos desde cero. Este DTO solo permite la transición de
 * estado (confirmar / cancelar), que es la operación real que hace un
 * administrador sobre una reserva existente.
 */
export class UpdateReservaDto {
  @IsEnum(EstadoReserva)
  estado!: EstadoReserva;
}
