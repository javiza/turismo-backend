import { IsBoolean } from 'class-validator';

/**
 * A propósito NO es un PartialType(CreateMensajeDto): un mensaje de
 * contacto ya enviado no se "edita" por el admin, solo se marca como
 * leído/no leído. Editar el contenido de lo que escribió el visitante
 * no tendría sentido de negocio.
 */
export class UpdateMensajeDto {
  @IsBoolean()
  leido!: boolean;
}
