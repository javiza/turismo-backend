import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { PaquetesService } from './paquetes.service';
import { Paquete } from './entities/paquete.entity';
import { PaqueteImagen } from './entities/paquete-imagen.entity';
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

describe('PaquetesService', () => {
  let service: PaquetesService;
  let paqueteRepo: MockRepository<Paquete>;
  let cache: ReturnType<typeof mockCache>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaquetesService,
        { provide: getRepositoryToken(Paquete), useValue: createMockRepository<Paquete>() },
        { provide: getRepositoryToken(PaqueteImagen), useValue: createMockRepository<PaqueteImagen>() },
        { provide: getRepositoryToken(DestinoImagen), useValue: createMockRepository<DestinoImagen>() },
        { provide: CacheService, useValue: mockCache() },
      ],
    }).compile();

    service = module.get(PaquetesService);
    paqueteRepo = module.get(getRepositoryToken(Paquete));
    cache = module.get(CacheService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('lanza NotFoundException si no existe', async () => {
      paqueteRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('guarda precioAnterior cuando el precio nuevo es menor', async () => {
      const paqueteExistente = {
        id: 1,
        precio: 100000,
        fechaInicio: '2026-08-01',
        fechaFin: '2026-08-10',
      };
      paqueteRepo.findOne.mockResolvedValue(paqueteExistente);
      paqueteRepo.save.mockImplementation((p) => Promise.resolve(p));

      const resultado = await service.update(1, { precio: 80000 } as any);

      expect(resultado.precioAnterior).toBe(100000);
      expect(resultado.precio).toBe(80000);
    });

    it('NO toca precioAnterior si el precio nuevo es mayor o igual', async () => {
      const paqueteExistente = {
        id: 1,
        precio: 100000,
        precioAnterior: undefined,
        fechaInicio: '2026-08-01',
        fechaFin: '2026-08-10',
      };
      paqueteRepo.findOne.mockResolvedValue(paqueteExistente);
      paqueteRepo.save.mockImplementation((p) => Promise.resolve(p));

      const resultado = await service.update(1, { precio: 120000 } as any);

      expect(resultado.precioAnterior).toBeUndefined();
    });

    it('invalida el caché tras actualizar', async () => {
      paqueteRepo.findOne.mockResolvedValue({
        id: 1,
        precio: 100000,
        fechaInicio: '2026-08-01',
        fechaFin: '2026-08-10',
      });
      paqueteRepo.save.mockImplementation((p) => Promise.resolve(p));

      await service.update(1, { precio: 90000 } as any);

      expect(cache.delByPrefix).toHaveBeenCalledWith('paquetes:');
    });
  });
});
