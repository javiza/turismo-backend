import { ArrayNotEmpty, IsArray, IsInt, IsPositive } from 'class-validator';

// Recibe el listado completo de ids de slides en el orden final que
// quedaron tras arrastrar en el panel admin; SlidesService.reordenar()
// les asigna 0..n-1 en ese orden.
export class ReordenarSlidesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  ids!: number[];
}
