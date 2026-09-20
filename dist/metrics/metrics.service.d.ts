import { Counter, Histogram, Registry } from 'prom-client';
export declare class MetricsService {
    readonly registry: Registry<"text/plain; version=0.0.4; charset=utf-8">;
    readonly httpRequestsTotal: Counter<"method" | "route" | "status_code">;
    readonly httpRequestDuration: Histogram<"method" | "route" | "status_code">;
    readonly queueJobsTotal: Counter<"status" | "queue">;
    constructor();
    observeHttpRequest(method: string, route: string, statusCode: number, durationSeconds: number): void;
    recordQueueJob(queue: string, status: 'completed' | 'failed'): void;
}
