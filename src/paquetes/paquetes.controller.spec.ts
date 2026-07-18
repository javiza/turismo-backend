import { Test, TestingModule } from '@nestjs/testing';
import { PaquetesController } from './paquetes.controller';
import { PaquetesService } from './paquetes.service';

describe('PaquetesController', () => {
  let controller: PaquetesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaquetesController],
      providers: [PaquetesService],
    }).compile();

    controller = module.get<PaquetesController>(PaquetesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
