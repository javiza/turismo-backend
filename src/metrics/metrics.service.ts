import { Injectable } from '@nestjs/common';
import {
  Counter,
  Histogram,
  Registry,
  collectDefaultMetrics,
} from 'prom-client';

/**
 * Métricas en formato Prometheus, expuestas en GET /metrics (ver
 * MetricsController). Un Prometheus/Grafana Cloud (o el scraper que
 * incluyen Railway/Render) puede apuntar directo a ese endpoint.
 *
 * Se usa un Registry propio (no el global de prom-client) para evitar
 * registrar métricas duplicadas si el módulo se llega a inicializar más
 * de una vez (ej. en tests).
 */
@Injectable()
export class MetricsService {
  readonly registry = new Registry();

  readonly httpRequestsTotal = new Counter({
    name: 'http_requests_total',
    help: 'Cantidad total de requests HTTP procesadas',
    labelNames: ['method', 'route', 'status_code'] as const,
    registers: [this.registry],
  });

  readonly httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duración de las requests HTTP en segundos',
    labelNames: ['method', 'route', 'status_code'] as const,
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    registers: [this.registry],
  });

  readonly queueJobsTotal = new Counter({
    name: 'queue_jobs_total',
    help: 'Cantidad de jobs procesados por las colas de BullMQ',
    labelNames: ['queue', 'status'] as const,
    registers: [this.registry],
  });

  constructor() {
    // Métricas por defecto de Node: uso de CPU, event loop lag,
    // handles/requests activos, heap, etc.
    collectDefaultMetrics({ register: this.registry });
  }

  observeHttpRequest(method: string, route: string, statusCode: number, durationSeconds: number) {
    const labels = { method, route, status_code: String(statusCode) };
    this.httpRequestsTotal.inc(labels);
    this.httpRequestDuration.observe(labels, durationSeconds);
  }

  recordQueueJob(queue: string, status: 'completed' | 'failed') {
    this.queueJobsTotal.inc({ queue, status });
  }
}
