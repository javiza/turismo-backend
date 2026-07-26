import { Test, TestingModule } from '@nestjs/testing';
import { PaquetesController } from './paquetes.controller';
import { PaquetesService } from './paquetes.service';

/**
 * Mock del service: no necesitamos listar cada método porque este test
 * solo verifica que el controller se pueda instanciar con sus
 * dependencias (DI correcta + guards resolubles). La lógica de negocio de
 * cada método ya se cubre en el *.service.spec.ts correspondiente.
 */
function crearMockService() {
  return {} as Record<string, jest.Mock>;
}

describe('PaquetesController', () => {
  let controller: PaquetesController;
  let service: Record<string, jest.Mock>;

  beforeEach(async () => {
    service = crearMockService() as Record<string, jest.Mock>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaquetesController],
      providers: [{ provide: PaquetesService, useValue: service }],
    }).compile();

    controller = module.get<PaquetesController>(PaquetesController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });
});
