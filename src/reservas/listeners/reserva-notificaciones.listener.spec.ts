import { ReservaNotificacionesListener } from './reserva-notificaciones.listener';
import { EmailService } from '../../email/email.service';
import { ReservaCreadaEvent } from '../../common/events/reserva-creada.event';

describe('ReservaNotificacionesListener', () => {
  let listener: ReservaNotificacionesListener;
  let emailService: { enviarConfirmacionReserva: jest.Mock };

  beforeEach(() => {
    emailService = { enviarConfirmacionReserva: jest.fn() };
    listener = new ReservaNotificacionesListener(emailService as unknown as EmailService);
  });

  it('envía la confirmación cuando el evento trae email', async () => {
    const event = new ReservaCreadaEvent(
      1,
      'cliente@test.com',
      'Cliente Test',
      'Paquete X',
      2,
      100000,
      '2026-09-01',
      '2026-09-05',
    );

    await listener.enviarConfirmacion(event);

    expect(emailService.enviarConfirmacionReserva).toHaveBeenCalledWith({
      email: 'cliente@test.com',
      nombreCliente: 'Cliente Test',
      nombrePaquete: 'Paquete X',
      cantidadPersonas: 2,
      montoTotal: 100000,
      fechaInicio: '2026-09-01',
      fechaFin: '2026-09-05',
    });
  });

  it('no hace nada si la reserva no tiene email (reserva de invitado sin correo)', async () => {
    const event = new ReservaCreadaEvent(1, undefined, 'Cliente', 'Paquete X', 1, 50000, 'a', 'b');

    await listener.enviarConfirmacion(event);

    expect(emailService.enviarConfirmacionReserva).not.toHaveBeenCalled();
  });

  it('no relanza si EmailService falla (un correo fallido no debe romper el listener)', async () => {
    emailService.enviarConfirmacionReserva.mockRejectedValue(new Error('cola caída'));
    const event = new ReservaCreadaEvent(1, 'a@a.com', 'Cliente', 'Paquete', 1, 1000, 'a', 'b');

    await expect(listener.enviarConfirmacion(event)).resolves.toBeUndefined();
  });
});
