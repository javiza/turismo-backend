import { IsInt, IsOptional, IsPositive } from 'class-validator';

/**
 * El frontend llama a este endpoint cuando un visitante abre la ficha de
 * un destino o de un paquete. ip/user_agent/pais/ciudad NO se piden acá:
 * ip y user-agent se capturan del propio request en el servidor (no hay
 * que confiar en lo que mande el cliente), y pais/ciudad quedan nulos por
 * ahora — geolocalizar la IP requiere un servicio externo (p.ej. MaxMind
 * GeoLite2 o ipapi) que no está integrado todavía.
 */
export class CreateVisitaDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  destinoId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  paqueteId?: number;
}
