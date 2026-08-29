import { EmailService } from '../../email/email.service';
import { ReservaCreadaEvent } from '../../common/events/reserva-creada.event';
export declare class ReservaNotificacionesListener {
    private readonly emailService;
    private readonly logger;
    constructor(emailService: EmailService);
    enviarConfirmacion(event: ReservaCreadaEvent): Promise<void>;
}
