import { PartialType, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateOfertaDto } from './create-oferta.dto';

export class UpdateOfertaDto extends PartialType(OmitType(CreateOfertaDto, ['imagenes', 'imagenPrincipal'] as const)) {
  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}
