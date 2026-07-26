import { EmailProcessor } from './email.processor';
import { EmailService } from './email.service';

describe('EmailProcessor', () => {
  let processor: EmailProcessor;
  let emailService: { sendImmediate: jest.Mock };

  beforeEach(() => {
    emailService = { sendImmediate: jest.fn() };
    processor = new EmailProcessor(emailService as unknown as EmailService);
  });

  it('envía el correo delegando en EmailService.sendImmediate', async () => {
    emailService.sendImmediate.mockResolvedValue(undefined);

    const job = {
      data: { to: 'a@a.com', subject: 'Hola', html: '<p>hi</p>' },
      attemptsMade: 0,
    } as any;

    await processor.process(job);

    expect(emailService.sendImmediate).toHaveBeenCalledWith('a@a.com', 'Hola', '<p>hi</p>');
  });

  it('relanza el error para que BullMQ reintente el job', async () => {
    emailService.sendImmediate.mockRejectedValue(new Error('SMTP caído'));

    const job = {
      data: { to: 'a@a.com', subject: 'Hola', html: '<p>hi</p>' },
      attemptsMade: 0,
    } as any;

    await expect(processor.process(job)).rejects.toThrow('SMTP caído');
  });
});
