import { PartialType, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateDestinoDto } from './create-destino.dto';

export class UpdateDestinoDto extends PartialType(OmitType(CreateDestinoDto, ['imagenes', 'imagenPrincipal'] as const)) {
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
