import { PartialType, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreatePaqueteDto } from './create-paquete.dto';

export class UpdatePaqueteDto extends PartialType(
  OmitType(CreatePaqueteDto, ['imagenes', 'imagenPrincipal'] as const),
) {
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  // Al bajar el precio, PaquetesService.update() completa precioAnterior
  // automáticamente (para el tachado en la vitrina). Este flag es la
  // única forma de borrar esa marca de rebaja a mano, por ejemplo si el
  // admin quiere que el paquete deje de mostrarse como "en oferta".
  @IsOptional()
  @IsBoolean()
  limpiarPrecioAnterior?: boolean;
}
