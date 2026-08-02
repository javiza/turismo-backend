import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsUrl,
  IsBoolean,
} from 'class-validator';

export class CreateNoticiaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titulo!: string;

  @IsString()
  @IsNotEmpty()
  contenido!: string;

  @IsOptional()
  @IsUrl()
  imagenUrl?: string;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}
