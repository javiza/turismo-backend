import { IsEnum } from 'class-validator';
import { EstadoCotizacion } from '../entities/cotizacion.entity';

/** Solo permite que el admin cambie el estado (PENDIENTE/RESPONDIDA/CERRADA). */
export class UpdateCotizacionDto {
  @IsEnum(EstadoCotizacion)
  estado!: EstadoCotizacion;
}
