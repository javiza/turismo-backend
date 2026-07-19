import { IsBoolean, IsOptional, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { EstadoCotizacion } from '../entities/cotizacion.entity';

/**
 * Acciones que el admin puede hacer sobre una consulta ya recibida:
 * marcarla como leída y/o escribirle una respuesta al cliente. Escribir
 * una respuesta marca automáticamente leida=true y estado=RESPONDIDA
 * (ver CotizacionesService.responder), así que estado normalmente solo
 * se usa acá para cerrar (CERRADA) una consulta ya resuelta.
 */
export class AdminCotizacionDto {
  @IsOptional()
  @IsBoolean()
  leida?: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  respuesta?: string;

  @IsOptional()
  @IsEnum(EstadoCotizacion)
  estado?: EstadoCotizacion;
}
