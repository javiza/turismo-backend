import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsInt,
  IsPositive,
  IsObject,
} from 'class-validator';

export class CreateAnalyticsEventoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  tipoEvento!: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  destinoId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  paqueteId?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
