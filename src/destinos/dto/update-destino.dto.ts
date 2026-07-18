import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateDestinoDto } from './create-destino.dto';

export class UpdateDestinoDto extends PartialType(CreateDestinoDto) {
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
