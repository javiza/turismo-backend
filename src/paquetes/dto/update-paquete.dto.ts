import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreatePaqueteDto } from './create-paquete.dto';

export class UpdatePaqueteDto extends PartialType(CreatePaqueteDto) {
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
