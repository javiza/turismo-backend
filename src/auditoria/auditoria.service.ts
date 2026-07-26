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

  /**
   * Borra registros de auditoría más viejos que `diasRetencion` días.
   * Se llama desde una tarea en segundo plano (ver src/queue/tasks.processor.ts),
   * nunca desde un endpoint HTTP: es una operación de mantenimiento, no de negocio.
   */
  async limpiarAntiguos(diasRetencion: number): Promise<number> {
    const limite = new Date();
    limite.setDate(limite.getDate() - diasRetencion);

    const resultado = await this.auditoriaRepository
      .createQueryBuilder()
      .delete()
      .where('created_at < :limite', { limite })
      .execute();

    return resultado.affected ?? 0;
  }
}
