import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';

import { Visita } from './entities/visita.entity';
import { Destino } from '../destinos/entities/destino.entity';
import { Paquete } from '../paquetes/entities/paquete.entity';
import { CreateVisitaDto } from './dto/create-visita.dto';

@Injectable()
export class VisitasService {
  constructor(
    @InjectRepository(Visita)
    private readonly visitaRepository: Repository<Visita>,
  ) {}

  async registrar(
    dto: CreateVisitaDto,
    meta: { ip?: string; userAgent?: string },
  ): Promise<void> {
    if (!dto.destinoId && !dto.paqueteId) {
      throw new BadRequestException(
        'Debes indicar destinoId o paqueteId para registrar la visita',
      );
    }

    const visita = this.visitaRepository.create({
      destino: dto.destinoId ? ({ id: dto.destinoId } as Destino) : undefined,
      paquete: dto.paqueteId ? ({ id: dto.paqueteId } as Paquete) : undefined,
      ip: meta.ip,
      userAgent: meta.userAgent,
    });

    try {
      await this.visitaRepository.save(visita);
    } catch (error) {
      // Tracking de visitas: si el destino/paquete no existe (FK inválida)
      // no vale la pena romper la navegación del visitante con un 500/400
      // ruidoso — simplemente no se registra la visita.
      if (
        error instanceof QueryFailedError &&
        (error as unknown as { code?: string }).code === '23503'
      ) {
        return;
      }
      throw error;
    }
  }
}
