import { EmailService } from '../../email/email.service';
import { CotizacionCreadaEvent, CotizacionRespondidaEvent } from '../../common/events/cotizacion.events';
export declare class CotizacionNotificacionesListener {
    private readonly emailService;
    private readonly logger;
    constructor(emailService: EmailService);
    alCrear(event: CotizacionCreadaEvent): Promise<void>;
    alResponder(event: CotizacionRespondidaEvent): Promise<void>;
}
