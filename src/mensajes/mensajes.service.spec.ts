import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { MensajesService } from './mensajes.service';
import { Mensaje } from './entities/mensaje.entity';
import { EmailService } from '../email/email.service';
import { createMockRepository, MockRepository } from '../test/typeorm-mock.helper';

describe('MensajesService', () => {
  let service: MensajesService;
  let repo: MockRepository<Mensaje>;
  let emailService: { notificarNuevoMensaje: jest.Mock };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MensajesService,
        { provide: getRepositoryToken(Mensaje), useValue: createMockRepository<Mensaje>() },
        { provide: EmailService, useValue: { notificarNuevoMensaje: jest.fn() } },
      ],
    }).compile();

    service = module.get(MensajesService);
    repo = module.get(getRepositoryToken(Mensaje));
    emailService = module.get(EmailService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('guarda el mensaje y notifica al admin sin bloquear la respuesta', async () => {
      const dto = { nombre: 'Ana', correo: 'ana@test.com', asunto: 'Consulta', mensaje: 'Hola' };
      repo.save.mockResolvedValue({ id: 1, ...dto, leido: false });

      const result = await service.create(dto as any);

      expect(result.leido).toBe(false);
      expect(emailService.notificarNuevoMensaje).toHaveBeenCalledWith({
        nombre: 'Ana',
        correo: 'ana@test.com',
        asunto: 'Consulta',
        mensaje: 'Hola',
      });
    });
  });

  describe('findOne', () => {
    it('lanza NotFoundException si no existe', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('marca leido según el dto', async () => {
      repo.findOne.mockResolvedValue({ id: 1, leido: false });
      repo.save.mockImplementation((m) => Promise.resolve(m));

      const result = await service.update(1, { leido: true });
      expect(result.leido).toBe(true);
    });
  });
});
