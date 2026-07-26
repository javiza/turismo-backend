import { IsNumber, Min, Max } from 'class-validator';

export class UpdateConfiguracionFinancieraDto {
  // 0-100: la normativa chilena de IVA sube de tanto en tanto (ver nota
  // en la entidad); el rango amplio es a propósito para no tener que
  // tocar código si algún día cambia a otro tipo de impuesto porcentual.
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  porcentajeImpuesto!: number;
}
