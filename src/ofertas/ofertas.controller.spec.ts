import { Test, TestingModule } from '@nestjs/testing';
import { OfertasController } from './ofertas.controller';
import { OfertasService } from './ofertas.service';

describe('OfertasController', () => {
  let controller: OfertasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfertasController],
      providers: [OfertasService],
    }).compile();

    controller = module.get<OfertasController>(OfertasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
