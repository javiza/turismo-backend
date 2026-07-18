import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateOfertaDto } from './create-oferta.dto';

export class UpdateOfertaDto extends PartialType(CreateOfertaDto) {
  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}
