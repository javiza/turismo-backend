import { IsEmail } from 'class-validator';

export class ForgotPasswordClienteDto {
  @IsEmail({}, { message: 'Ingresa un email válido' })
  email!: string;
}
