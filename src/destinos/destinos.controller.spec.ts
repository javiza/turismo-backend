import { Test, TestingModule } from '@nestjs/testing';
import { DestinosController } from './destinos.controller';
import { DestinosService } from './destinos.service';

/**
 * Mock del service: no necesitamos listar cada método porque este test
 * solo verifica que el controller se pueda instanciar con sus
 * dependencias (DI correcta + guards resolubles). La lógica de negocio de
 * cada método ya se cubre en el *.service.spec.ts correspondiente.
 */
function crearMockService() {
  return {} as Record<string, jest.Mock>;
}

describe('DestinosController', () => {
  let controller: DestinosController;
  let service: Record<string, jest.Mock>;

  beforeEach(async () => {
    service = crearMockService() as Record<string, jest.Mock>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DestinosController],
      providers: [{ provide: DestinosService, useValue: service }],
    }).compile();

    controller = module.get<DestinosController>(DestinosController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });
});
