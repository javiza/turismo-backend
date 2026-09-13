import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  ConfiguracionIntegracion,
  ClaveIntegracion,
} from './entities/configuracion-integracion.entity';
import { cifrar, descifrar } from '../common/utils/crypto.util';

export interface ConfigSmtp {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
  adminEmail: string;
}

export interface ConfigWhatsapp {
  token: string;
  phoneNumberId: string;
  adminNumber: string;
  apiVersion: string;
}

export interface ConfigTransbank {
  commerceCode: string;
  apiKey: string;
  environment: 'integration' | 'production';
}

export interface ConfigMercadoPago {
  accessToken: string;
  publicKey: string;
}

/**
 * Fuente única de verdad para credenciales de integraciones externas.
 * Prioridad: 1) lo que el admin guardó desde el panel (cifrado en DB),
 * 2) las variables de entorno del .env, como fallback — así el sistema
 * sigue funcionando igual que antes para quien no haya tocado el panel
 * todavía, y no hay que redeployar solo para cambiar una API key.
 */
@Injectable()
export class ConfiguracionService {
  private readonly logger = new Logger(ConfiguracionService.name);

  constructor(
    @InjectRepository(ConfiguracionIntegracion)
    private readonly repo: Repository<ConfiguracionIntegracion>,
    private readonly env: ConfigService,
  ) {}

  private async obtenerJson<T>(clave: ClaveIntegracion): Promise<Partial<T> | null> {
    const fila = await this.repo.findOne({ where: { clave } });
    if (!fila) return null;

    try {
      return JSON.parse(descifrar(fila.valorCifrado)) as Partial<T>;
    } catch (err) {
      this.logger.error(
        `No se pudo descifrar la configuración de "${clave}". ¿Cambió CONFIG_ENCRYPTION_KEY? ${err}`,
      );
      return null;
    }
  }

  async guardar<T>(clave: ClaveIntegracion, data: T, adminId?: number): Promise<void> {
    const valorCifrado = cifrar(JSON.stringify(data));

    const existente = await this.repo.findOne({ where: { clave } });
    if (existente) {
      existente.valorCifrado = valorCifrado;
      existente.actualizadoPorId = adminId;
      await this.repo.save(existente);
    } else {
      await this.repo.save(
        this.repo.create({ clave, valorCifrado, actualizadoPorId: adminId }),
      );
    }
  }

  async obtenerEstado(clave: ClaveIntegracion): Promise<{ configuradoEnDb: boolean; actualizadoEn?: Date }> {
    const fila = await this.repo.findOne({ where: { clave } });
    return { configuradoEnDb: !!fila, actualizadoEn: fila?.updatedAt };
  }

  async obtenerSmtp(): Promise<ConfigSmtp> {
    const guardado = await this.obtenerJson<ConfigSmtp>(ClaveIntegracion.SMTP);
    return {
      host: guardado?.host ?? this.env.get<string>('SMTP_HOST') ?? '',
      port: guardado?.port ?? Number(this.env.get<string>('SMTP_PORT') ?? 587),
      user: guardado?.user ?? this.env.get<string>('SMTP_USER') ?? '',
      password: guardado?.password ?? this.env.get<string>('SMTP_PASSWORD') ?? '',
      from: guardado?.from ?? this.env.get<string>('SMTP_FROM') ?? 'no-reply@agencia-viajes.local',
      adminEmail:
        guardado?.adminEmail ?? this.env.get<string>('ADMIN_NOTIFICATION_EMAIL') ?? '',
    };
  }

  async obtenerWhatsapp(): Promise<ConfigWhatsapp> {
    const guardado = await this.obtenerJson<ConfigWhatsapp>(ClaveIntegracion.WHATSAPP);
    return {
      token: guardado?.token ?? this.env.get<string>('WHATSAPP_TOKEN') ?? '',
      phoneNumberId:
        guardado?.phoneNumberId ?? this.env.get<string>('WHATSAPP_PHONE_NUMBER_ID') ?? '',
      adminNumber: guardado?.adminNumber ?? this.env.get<string>('WHATSAPP_ADMIN_NUMBER') ?? '',
      apiVersion:
        guardado?.apiVersion ?? this.env.get<string>('WHATSAPP_API_VERSION') ?? 'v20.0',
    };
  }

  async obtenerTransbank(): Promise<ConfigTransbank> {
    const guardado = await this.obtenerJson<ConfigTransbank>(ClaveIntegracion.TRANSBANK);
    return {
      commerceCode: guardado?.commerceCode ?? this.env.get<string>('TRANSBANK_COMMERCE_CODE') ?? '',
      apiKey: guardado?.apiKey ?? this.env.get<string>('TRANSBANK_API_KEY') ?? '',
      environment:
        guardado?.environment ??
        (this.env.get<string>('TRANSBANK_ENVIRONMENT') as 'integration' | 'production') ??
        'integration',
    };
  }

  async obtenerMercadoPago(): Promise<ConfigMercadoPago> {
    const guardado = await this.obtenerJson<ConfigMercadoPago>(ClaveIntegracion.MERCADOPAGO);
    return {
      accessToken: guardado?.accessToken ?? this.env.get<string>('MERCADOPAGO_ACCESS_TOKEN') ?? '',
      publicKey: guardado?.publicKey ?? this.env.get<string>('MERCADOPAGO_PUBLIC_KEY') ?? '',
    };
  }
}
