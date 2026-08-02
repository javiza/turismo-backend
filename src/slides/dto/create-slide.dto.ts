import {
  IsEnum,
  IsInt,
  IsPositive,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { TipoSlide } from '../entities/home-slide.entity';

export class CreateSlideDto {
  @IsEnum(TipoSlide)
  tipo!: TipoSlide;

  @IsInt()
  @IsPositive()
  referenciaId!: number;

  @IsOptional()
  @IsInt()
  orden?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
