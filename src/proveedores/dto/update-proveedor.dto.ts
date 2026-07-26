import { IsBoolean } from 'class-validator';

export class UpdateProveedorDto {
  @IsBoolean()
  leido!: boolean;
}
