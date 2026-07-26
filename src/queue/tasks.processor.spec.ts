import { TasksProcessor } from './tasks.processor';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { PaquetesService } from '../paquetes/paquetes.service';
import { OfertasService } from '../ofertas/ofertas.service';

describe('TasksProcessor', () => {
  let processor: TasksProcessor;
  let auditoriaService: { limpiarAntiguos: jest.Mock };
  let paquetesService: { limpiarDesactivadosAntiguos: jest.Mock };
  let ofertasService: { limpiarDesactivadasAntiguas: jest.Mock };

  beforeEach(() => {
    auditoriaService = { limpiarAntiguos: jest.fn() };
    paquetesService = { limpiarDesactivadosAntiguos: jest.fn().mockResolvedValue(0) };
    ofertasService = { limpiarDesactivadasAntiguas: jest.fn().mockResolvedValue(0) };
    processor = new TasksProcessor(
      auditoriaService as unknown as AuditoriaService,
      paquetesService as unknown as PaquetesService,
      ofertasService as unknown as OfertasService,
    );
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

  it('ejecuta la limpieza de paquetes y ofertas desactivados con los meses de retención del job', async () => {
    paquetesService.limpiarDesactivadosAntiguos.mockResolvedValue(2);
    ofertasService.limpiarDesactivadasAntiguas.mockResolvedValue(3);

    const job = {
      name: 'limpiar-servicios-desactivados',
      data: { mesesRetencion: 6 },
    } as any;

    await processor.process(job);

    expect(paquetesService.limpiarDesactivadosAntiguos).toHaveBeenCalledWith(6);
    expect(ofertasService.limpiarDesactivadasAntiguas).toHaveBeenCalledWith(6);
  });

  it('no lanza ni llama a nada si el nombre del job es desconocido', async () => {
    const job = { name: 'job-inexistente', data: {} } as any;

    await expect(processor.process(job)).resolves.toBeUndefined();
    expect(auditoriaService.limpiarAntiguos).not.toHaveBeenCalled();
  });
});
