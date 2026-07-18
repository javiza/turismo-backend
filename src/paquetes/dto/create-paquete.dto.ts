import {
  IsInt,
  IsPositive,
  IsString,
  IsNotEmpty,
  MaxLength,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';

export class CreatePaqueteDto {
  @IsInt()
  @IsPositive()
  destinoId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio!: number;

  @IsInt()
  @Min(0)
  cupos!: number;

  @IsDateString()
  fechaInicio!: string;

  @IsDateString()
  fechaFin!: string;
}
