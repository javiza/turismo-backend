import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const start = process.hrtime.bigint();

    // route.path (ej. "/api/v1/destinos/:id") en vez de la URL cruda, para
    // no explotar la cardinalidad de la métrica con un label por cada id.
    const route = request.route?.path ?? request.url;

    return next.handle().pipe(
      tap({
        next: () => this.registrar(request.method, route, response.statusCode, start),
        error: () =>
          this.registrar(request.method, route, response.statusCode || 500, start),
      }),
    );
  }

  private registrar(method: string, route: string, statusCode: number, start: bigint) {
    const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9;
    this.metrics.observeHttpRequest(method, route, statusCode, durationSeconds);
  }
}
