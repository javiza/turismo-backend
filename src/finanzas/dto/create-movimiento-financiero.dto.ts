import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import {
  TipoMovimientoFinanciero,
  CategoriaGasto,
} from '../entities/movimiento-financiero.entity';

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

  // Solo tiene sentido cuando el movimiento es un gasto (EGRESO_MANUAL).
  // Para el resto de los tipos se ignora aunque venga en el body (ver
  // FinanzasService.registrarMovimiento).
  @ValidateIf(
    (dto: CreateMovimientoFinancieroDto) =>
      dto.tipo === TipoMovimientoFinanciero.EGRESO_MANUAL,
  )
  @IsEnum(CategoriaGasto)
  @IsOptional()
  categoria?: CategoriaGasto;
}
