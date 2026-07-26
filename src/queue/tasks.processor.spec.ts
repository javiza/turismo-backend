import { TasksProcessor } from './tasks.processor';
import { AuditoriaService } from '../auditoria/auditoria.service';

describe('TasksProcessor', () => {
  let processor: TasksProcessor;
  let auditoriaService: { limpiarAntiguos: jest.Mock };

  beforeEach(() => {
    auditoriaService = { limpiarAntiguos: jest.fn() };
    processor = new TasksProcessor(auditoriaService as unknown as AuditoriaService);
  });

  it('ejecuta la limpieza de auditoría con los días de retención del job', async () => {
    auditoriaService.limpiarAntiguos.mockResolvedValue(42);

    const job = {
      name: 'limpiar-auditoria-antigua',
      data: { diasRetencion: 180 },
    } as any;

    await processor.process(job);

    expect(auditoriaService.limpiarAntiguos).toHaveBeenCalledWith(180);
  });

  it('no lanza ni llama a nada si el nombre del job es desconocido', async () => {
    const job = { name: 'job-inexistente', data: {} } as any;

    await expect(processor.process(job)).resolves.toBeUndefined();
    expect(auditoriaService.limpiarAntiguos).not.toHaveBeenCalled();
  });
});
