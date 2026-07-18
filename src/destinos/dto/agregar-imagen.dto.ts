import { IsUrl } from 'class-validator';

export class AgregarImagenDto {
  @IsUrl()
  url!: string;
}
