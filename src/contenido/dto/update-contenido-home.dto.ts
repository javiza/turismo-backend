import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  MaxLength,
  ValidateNested,
  IsArray,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

class ResenaHomeDto {
  @IsString()
  @MaxLength(150)
  nombre!: string;

  @IsString()
  @MaxLength(1000)
  texto!: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  valoracion?: number;
}

export class UpdateContenidoHomeDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombreAgencia?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  titulo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  subtitulo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  presentacion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  mision?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  vision?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  valores?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => ResenaHomeDto)
  resenas?: ResenaHomeDto[];
}
