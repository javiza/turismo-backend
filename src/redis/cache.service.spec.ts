import { CacheService } from './cache.service';

function crearRedisFalso() {
  return {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    scanStream: jest.fn(),
    pipeline: jest.fn(),
  };
}

describe('CacheService', () => {
  let redis: ReturnType<typeof crearRedisFalso>;
  let service: CacheService;

  beforeEach(() => {
    redis = crearRedisFalso();
    service = new CacheService(redis as any);
  });

  describe('get/set', () => {
    it('devuelve null si la clave no existe', async () => {
      redis.get.mockResolvedValue(null);
      await expect(service.get('inexistente')).resolves.toBeNull();
    });

    it('deserializa el JSON guardado', async () => {
      redis.get.mockResolvedValue(JSON.stringify({ a: 1 }));
      await expect(service.get('clave')).resolves.toEqual({ a: 1 });
    });

    it('serializa el valor y aplica el TTL en segundos', async () => {
      await service.set('clave', { a: 1 }, 120);
      expect(redis.set).toHaveBeenCalledWith('clave', JSON.stringify({ a: 1 }), 'EX', 120);
    });

    it('no lanza si Redis falla al leer (caché es opcional, no crítico)', async () => {
      redis.get.mockRejectedValue(new Error('conexión caída'));
      await expect(service.get('clave')).resolves.toBeNull();
    });
  });

  describe('wrap', () => {
    it('usa el valor cacheado si existe, sin llamar al loader', async () => {
      redis.get.mockResolvedValue(JSON.stringify('cacheado'));
      const loader = jest.fn().mockResolvedValue('fresco');

      const resultado = await service.wrap('clave', 60, loader);

      expect(resultado).toBe('cacheado');
      expect(loader).not.toHaveBeenCalled();
    });

    it('llama al loader y cachea el resultado si no hay valor cacheado', async () => {
      redis.get.mockResolvedValue(null);
      const loader = jest.fn().mockResolvedValue('fresco');

      const resultado = await service.wrap('clave', 60, loader);

      expect(resultado).toBe('fresco');
      expect(loader).toHaveBeenCalledTimes(1);
      expect(redis.set).toHaveBeenCalledWith('clave', JSON.stringify('fresco'), 'EX', 60);
    });
  });

  describe('delByPrefix', () => {
    it('borra todas las claves que matchean el prefijo vía SCAN + pipeline', async () => {
      async function* fakeStream() {
        yield ['destinos:list:public'];
        yield ['destinos:detail:1'];
      }
      redis.scanStream.mockReturnValue(fakeStream());

      const pipelineDel = jest.fn();
      const pipelineExec = jest.fn();
      redis.pipeline.mockReturnValue({ del: pipelineDel, exec: pipelineExec });

      await service.delByPrefix('destinos:');

      expect(redis.scanStream).toHaveBeenCalledWith({ match: 'destinos:*', count: 100 });
      expect(pipelineDel).toHaveBeenCalledWith('destinos:list:public');
      expect(pipelineDel).toHaveBeenCalledWith('destinos:detail:1');
      expect(pipelineExec).toHaveBeenCalled();
    });
  });
});
