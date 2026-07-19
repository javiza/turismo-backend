import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContenidoHome } from './entities/contenido-home.entity';
import { UpdateContenidoHomeDto } from './dto/update-contenido-home.dto';

const SINGLETON_ID = 1;

@Injectable()
export class ContenidoService {
  constructor(
    @InjectRepository(ContenidoHome)
    private readonly contenidoRepository: Repository<ContenidoHome>,
  ) {}

  /**
   * Lectura pública (home del sitio). Si por algún motivo la fila
   * seed no existe (ej. entorno recién migrado sin re-sembrar), se crea
   * una con textos vacíos en vez de romper la home.
   */
  async obtener(): Promise<ContenidoHome> {
    const existente = await this.contenidoRepository.findOne({
      where: { id: SINGLETON_ID },
    });

    if (existente) {
      return existente;
    }

    const nuevo = this.contenidoRepository.create({
      id: SINGLETON_ID,
      nombreAgencia: 'Tu Agencia de Viajes',
      titulo: 'Programa tus vacaciones con nosotros',
      subtitulo:
        'Arma tu próximo viaje con destinos, paquetes y ofertas curadas por nuestro equipo — todo reservable en minutos.',
      presentacion: '',
      mision: '',
      vision: '',
      valores: '',
      resenas: [],
    });

    return this.contenidoRepository.save(nuevo);
  }

  async actualizar(dto: UpdateContenidoHomeDto): Promise<ContenidoHome> {
    const contenido = await this.obtener();
    Object.assign(contenido, dto);
    return this.contenidoRepository.save(contenido);
  }
}
