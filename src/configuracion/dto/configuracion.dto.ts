import { IsIn, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class ActualizarSmtpDto {
  @IsString()
  @MinLength(1)
  host!: string;

  @IsInt()
  port!: number;

  @IsString()
  @MinLength(1)
  user!: string;

  // Opcional: si el admin deja este campo vacío al editar, se conserva la
  // contraseña ya guardada en vez de sobreescribirla con "" (ver
  // ConfiguracionController.actualizarSmtp).
  @IsOptional()
  @IsString()
  password?: string;

  @IsString()
  @MinLength(1)
  from!: string;

  @IsString()
  @MinLength(1)
  adminEmail!: string;
}

export class ActualizarWhatsappDto {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  @MinLength(1)
  phoneNumberId!: string;

  @IsString()
  @MinLength(1)
  adminNumber!: string;

  @IsOptional()
  @IsString()
  apiVersion?: string;
}

export class ActualizarTransbankDto {
  @IsString()
  @MinLength(1)
  commerceCode!: string;

  @IsOptional()
  @IsString()
  apiKey?: string;

  @IsIn(['integration', 'production'])
  environment!: 'integration' | 'production';
}

export class ActualizarMercadoPagoDto {
  @IsOptional()
  @IsString()
  accessToken?: string;

  @IsString()
  @MinLength(1)
  publicKey!: string;
}
