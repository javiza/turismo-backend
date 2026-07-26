import { WhatsappProcessor } from './whatsapp.processor';
import { WhatsappService } from './whatsapp.service';

describe('WhatsappProcessor', () => {
  let processor: WhatsappProcessor;
  let whatsappService: { enviarTextoImmediate: jest.Mock };

  beforeEach(() => {
    whatsappService = { enviarTextoImmediate: jest.fn() };
    processor = new WhatsappProcessor(whatsappService as unknown as WhatsappService);
  });

  it('envía el mensaje delegando en WhatsappService.enviarTextoImmediate', async () => {
    whatsappService.enviarTextoImmediate.mockResolvedValue(undefined);

    const job = { data: { to: '56912345678', texto: 'Hola' }, attemptsMade: 0 } as any;
    await processor.process(job);

    expect(whatsappService.enviarTextoImmediate).toHaveBeenCalledWith('56912345678', 'Hola');
  });

  it('relanza el error para que BullMQ reintente el job', async () => {
    whatsappService.enviarTextoImmediate.mockRejectedValue(new Error('Graph API caída'));

    const job = { data: { to: '56912345678', texto: 'Hola' }, attemptsMade: 0 } as any;
    await expect(processor.process(job)).rejects.toThrow('Graph API caída');
  });
});
