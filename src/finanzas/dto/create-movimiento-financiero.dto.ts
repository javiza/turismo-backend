import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { TipoMovimientoFinanciero } from '../entities/movimiento-financiero.entity';

export class CreateMovimientoFinancieroDto {
  @IsEnum(TipoMovimientoFinanciero)
  tipo!: TipoMovimientoFinanciero;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  monto!: number;

  // Obligatoria a propósito: un movimiento manual (sobre todo un
  // robo/estafa/pérdida) sin explicación no sirve para nada al revisar
  // el historial más adelante.
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  descripcion!: string;
}
