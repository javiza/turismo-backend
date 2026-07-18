import { IsJWT } from 'class-validator';

export class RefreshTokenClienteDto {
  @IsJWT()
  refreshToken!: string;
}
