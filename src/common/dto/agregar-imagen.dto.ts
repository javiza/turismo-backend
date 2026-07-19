import { IsUrl } from 'class-validator';

/**
 * DTO compartido para agregar una imagen a la galería de un destino,
 * paquete u oferta. Centralizado acá (en vez de repetido por módulo)
 * para que las tres galerías se validen exactamente igual.
 */
export class AgregarImagenDto {
  @IsUrl()
  url!: string;
}
