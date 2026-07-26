import { Controller, Get, Header } from '@nestjs/common';

import { MetricsService } from './metrics.service';

/**
 * Sin autenticación a propósito (así lo esperan los scrapers de
 * Prometheus por defecto), pero NO expone datos de negocio, solo conteos
 * y tiempos. Si se despliega en un entorno donde /metrics no debe ser
 * público, restringirlo por IP a nivel de proxy/load balancer, no acá.
 */
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  async obtener(): Promise<string> {
    return this.metrics.registry.metrics();
  }
}
