import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Auditoria, AccionAuditoria } from './entities/auditoria.entity';

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(Auditoria)
    private readonly auditoriaRepository: Repository<Auditoria>,
  ) {}

  async registrar(params: {
    tabla: string;
    accion: AccionAuditoria;
    registroId?: number;
    usuarioId?: number;
    datosAnteriores?: Record<string, unknown>;
    datosNuevos?: Record<string, unknown>;
  }): Promise<void> {
    const registro = this.auditoriaRepository.create(params);
    await this.auditoriaRepository.save(registro);
  }

  /** Panel admin: historial de cambios, opcionalmente filtrado por tabla. */
  async findAll(tabla?: string): Promise<Auditoria[]> {
    return this.auditoriaRepository.find({
      where: tabla ? { tabla } : {},
      order: { createdAt: 'DESC' },
      take: 200,
    });
  }
}
