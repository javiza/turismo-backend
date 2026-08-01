import {
  IsEnum,
  IsInt,
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
  MetodoPago,
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

  // "Quién pagó" — solo tiene sentido cuando el movimiento es un
  // ingreso (INGRESO_MANUAL). Igual criterio que categoria: se ignora
  // para el resto de los tipos aunque venga en el body.
  @ValidateIf(
    (dto: CreateMovimientoFinancieroDto) =>
      dto.tipo === TipoMovimientoFinanciero.INGRESO_MANUAL,
  )
  @IsOptional()
  @IsInt()
  clienteId?: number;

  @ValidateIf(
    (dto: CreateMovimientoFinancieroDto) =>
      dto.tipo === TipoMovimientoFinanciero.INGRESO_MANUAL,
  )
  @IsOptional()
  @IsString()
  @MaxLength(150)
  pagadorNombre?: string;

  @ValidateIf(
    (dto: CreateMovimientoFinancieroDto) =>
      dto.tipo === TipoMovimientoFinanciero.INGRESO_MANUAL,
  )
  @IsOptional()
  @IsEnum(MetodoPago)
  metodoPago?: MetodoPago;
}
