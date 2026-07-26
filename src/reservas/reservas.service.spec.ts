import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';

import { ReservasService } from './reservas.service';
import { Reserva, EstadoReserva } from './entities/reserva.entity';
import { Paquete } from '../paquetes/entities/paquete.entity';
import { Oferta } from '../ofertas/entities/oferta.entity';
import { RESERVA_CREADA_EVENT } from '../common/events/reserva-creada.event';

/**
 * Arma un "manager" de TypeORM falso que entiende getRepository(Paquete),
 * getRepository(Reserva) y getRepository(Oferta), cada uno con su propio
 * query builder configurable — así se puede simular el flujo completo de
 * create() (que corre dentro de una transacción) sin una BD real.
 */
function crearManagerFalso(opts: {
  paquete: any;
  personasOcupadas: number;
  descuentoActivo?: number;
}) {
  const paqueteQb = {
    setLock: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(opts.paquete),
  };

  const reservaQb = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockResolvedValue({ ocupados: String(opts.personasOcupadas) }),
  };

  const reservaRepo = {
    createQueryBuilder: jest.fn(() => reservaQb),
    create: jest.fn((dto) => dto),
    save: jest.fn((entity) => Promise.resolve({ id: 1, ...entity })),
  };

  const ofertaQb = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(
      opts.descuentoActivo ? { descuento: opts.descuentoActivo } : null,
    ),
  };

  return {
    getRepository: (entity: any) => {
      if (entity === Paquete) {
        return { createQueryBuilder: jest.fn(() => paqueteQb) };
      }
      if (entity === Reserva) {
        return reservaRepo;
      }
      if (entity === Oferta) {
        return { createQueryBuilder: jest.fn(() => ofertaQb) };
      }
      throw new Error(`Entidad no mockeada: ${entity}`);
    },
  };
}

describe('ReservasService', () => {
  let service: ReservasService;
  let eventEmitter: jest.Mocked<EventEmitter2>;
  let reservaRepository: { manager: { transaction: jest.Mock }; findOne: jest.Mock };

  const paqueteBase = {
    id: 10,
    activo: true,
    cupos: 20,
    precio: 100000,
    nombre: 'Trekking Torres del Paine',
    fechaInicio: '2026-09-01',
    fechaFin: '2026-09-05',
  };

  beforeEach(async () => {
    reservaRepository = {
      manager: {
        transaction: jest.fn((cb: (manager: unknown) => unknown) => cb(undefined)),
      },
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservasService,
        { provide: getRepositoryToken(Reserva), useValue: reservaRepository },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    service = module.get(ReservasService);
    eventEmitter = module.get(EventEmitter2);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('lanza NotFoundException si el paquete no existe o está inactivo', async () => {
      const manager = crearManagerFalso({ paquete: null, personasOcupadas: 0 });
      reservaRepository.manager.transaction.mockImplementation((cb: any) => cb(manager));

      await expect(
        service.create({ paqueteId: 10, cantidadPersonas: 2 } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('rechaza si no quedan cupos suficientes (respetando reservas ya ocupadas)', async () => {
      const manager = crearManagerFalso({ paquete: paqueteBase, personasOcupadas: 19 });
      reservaRepository.manager.transaction.mockImplementation((cb: any) => cb(manager));

      // cupos=20, ocupados=19 -> solo queda 1 disponible, se piden 2
      await expect(
        service.create({ paqueteId: 10, cantidadPersonas: 2 } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('crea la reserva, calcula el monto con descuento activo y emite el evento', async () => {
      const manager = crearManagerFalso({
        paquete: paqueteBase,
        personasOcupadas: 0,
        descuentoActivo: 10, // 10% de descuento
      });
      reservaRepository.manager.transaction.mockImplementation((cb: any) => cb(manager));

      const dto = {
        paqueteId: 10,
        cantidadPersonas: 2,
        nombreCliente: 'Juan Pérez',
        emailCliente: 'juan@test.com',
      };

      const reserva = await service.create(dto as any);

      // 100000 * 2 * 0.9 = 180000
      expect(reserva.montoTotal).toBe(180000);
      expect(reserva.estado).toBe(EstadoReserva.PENDIENTE);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        RESERVA_CREADA_EVENT,
        expect.objectContaining({ nombreCliente: 'Juan Pérez', montoTotal: 180000 }),
      );
    });
  });

  describe('cancelarPropia', () => {
    it('rechaza si la reserva no pertenece al cliente', async () => {
      reservaRepository.findOne.mockResolvedValue({ id: 1, clienteId: 5, estado: EstadoReserva.PENDIENTE });

      await expect(service.cancelarPropia(1, 999)).rejects.toThrow(ForbiddenException);
    });

    it('cancela la reserva propia correctamente', async () => {
      const reserva = { id: 1, clienteId: 5, estado: EstadoReserva.PENDIENTE };
      reservaRepository.findOne.mockResolvedValue(reserva);
      (reservaRepository as any).save = jest.fn((r) => Promise.resolve(r));

      const result = await service.cancelarPropia(1, 5);
      expect(result.estado).toBe(EstadoReserva.CANCELADA);
    });
  });
});
