import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { DestinosService } from './destinos.service';
import { Destino } from './entities/destino.entity';
import { DestinoImagen } from './entities/destino-imagen.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { CacheService } from '../redis/cache.service';
import { createMockRepository, MockRepository } from '../test/typeorm-mock.helper';

describe('DestinosService', () => {
  let service: DestinosService;
  let destinoRepo: MockRepository<Destino>;
  let cache: jest.Mocked<CacheService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DestinosService,
        { provide: getRepositoryToken(Destino), useValue: createMockRepository<Destino>() },
        { provide: getRepositoryToken(DestinoImagen), useValue: createMockRepository<DestinoImagen>() },
        { provide: getRepositoryToken(Categoria), useValue: createMockRepository<Categoria>() },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn(),
            del: jest.fn(),
            delByPrefix: jest.fn(),
            // wrap real (sin Redis detrás): así se prueba el flujo real
            // cache-miss -> loader -> guardar, sin depender de la
            // implementación interna de CacheService (que tiene su propio spec).
            wrap: jest.fn(async (_key: string, _ttl: number, loader: () => Promise<unknown>) => loader()),
          },
        },
      ],
    }).compile();

    service = module.get(DestinosService);
    destinoRepo = module.get(getRepositoryToken(Destino));
    cache = module.get(CacheService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('pasa por el caché (cache.wrap) y devuelve lo que resuelve la BD', async () => {
      const destinos = [{ id: 1, nombre: 'Pucón' }];
      destinoRepo.find.mockResolvedValue(destinos);

      const result = await service.findAll();

      expect(cache.wrap).toHaveBeenCalledWith(
        'destinos:list:public',
        300,
        expect.any(Function),
      );
      expect(result).toEqual(destinos);
    });
  });

  describe('findOne', () => {
    it('lanza NotFoundException si no existe', async () => {
      destinoRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('devuelve el destino si existe', async () => {
      const destino = { id: 1, nombre: 'Valdivia' };
      destinoRepo.findOne.mockResolvedValue(destino);
      await expect(service.findOne(1)).resolves.toEqual(destino);
    });
  });

  describe('create', () => {
    it('invalida el caché después de crear', async () => {
      destinoRepo.save.mockResolvedValue({ id: 5 });
      destinoRepo.findOne.mockResolvedValue({ id: 5, nombre: 'Nuevo' });

      await service.create({ nombre: 'Nuevo' } as any);

      expect(cache.delByPrefix).toHaveBeenCalledWith('destinos:');
    });
  });
});
