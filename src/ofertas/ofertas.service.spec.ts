import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { OfertasService } from './ofertas.service';
import { Oferta } from './entities/oferta.entity';
import { OfertaImagen } from './entities/oferta-imagen.entity';
import { Paquete } from '../paquetes/entities/paquete.entity';
import { PaqueteImagen } from '../paquetes/entities/paquete-imagen.entity';
import { DestinoImagen } from '../destinos/entities/destino-imagen.entity';
import { CacheService } from '../redis/cache.service';
import { createMockRepository, MockRepository } from '../test/typeorm-mock.helper';

function mockCache() {
  return {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn(),
    del: jest.fn(),
    delByPrefix: jest.fn(),
    wrap: jest.fn(async (_k: string, _t: number, loader: () => Promise<unknown>) => loader()),
  };
}

describe('OfertasService', () => {
  let service: OfertasService;
  let ofertaRepo: MockRepository<Oferta>;
  let cache: ReturnType<typeof mockCache>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfertasService,
        { provide: getRepositoryToken(Oferta), useValue: createMockRepository<Oferta>() },
        { provide: getRepositoryToken(Paquete), useValue: createMockRepository<Paquete>() },
        { provide: getRepositoryToken(PaqueteImagen), useValue: createMockRepository<PaqueteImagen>() },
        { provide: getRepositoryToken(DestinoImagen), useValue: createMockRepository<DestinoImagen>() },
        { provide: getRepositoryToken(OfertaImagen), useValue: createMockRepository<OfertaImagen>() },
        { provide: CacheService, useValue: mockCache() },
      ],
    }).compile();

    service = module.get(OfertasService);
    ofertaRepo = module.get(getRepositoryToken(Oferta));
    cache = module.get(CacheService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('rechaza si fechaFin no es posterior a fechaInicio', async () => {
      await expect(
        service.create({
          titulo: 'Oferta test',
          fechaInicio: '2026-08-10',
          fechaFin: '2026-08-01',
          paqueteId: 1,
          descuento: 10,
        } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('rechaza fechas iguales (no hay rango real de vigencia)', async () => {
      await expect(
        service.create({
          titulo: 'Oferta test',
          fechaInicio: '2026-08-10',
          fechaFin: '2026-08-10',
          paqueteId: 1,
          descuento: 10,
        } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('lanza NotFoundException si no existe', async () => {
      ofertaRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('invalida el caché después de borrar', async () => {
      ofertaRepo.findOne.mockResolvedValue({ id: 1 });
      await service.remove(1);
      expect(cache.delByPrefix).toHaveBeenCalledWith('ofertas:');
    });
  });
});
