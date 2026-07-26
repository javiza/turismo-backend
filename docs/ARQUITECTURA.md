# Arquitectura

## Vista general

```mermaid
flowchart TB
    subgraph Cliente
        WEB[Frontend Next.js/React]
    end

    subgraph API["API NestJS (contenedor web)"]
        HTTP[Controllers REST /api/v1/*]
        GUARD[Guards: JWT + Roles + Throttler]
        SVC[Services de negocio]
        CACHE[CacheService]
        EVT[EventEmitter2]
        LOG[Pino Logger]
        MET[MetricsInterceptor]
    end

    subgraph Workers["Worker de colas (mismo código, otro proceso/comando)"]
        EMAILP[EmailProcessor]
        WAP[WhatsappProcessor]
        TASKP[TasksProcessor]
    end

    subgraph Infra
        PG[(PostgreSQL)]
        REDIS[(Redis: caché + colas BullMQ)]
        CLOUD[(Cloudinary)]
        SMTP[[SMTP]]
        META[[WhatsApp Cloud API]]
    end

    WEB -->|HTTPS| HTTP
    HTTP --> GUARD --> SVC
    SVC --> PG
    SVC --> CACHE --> REDIS
    SVC -- emite eventos --> EVT
    EVT --> EMAILP
    SVC -- encola job --> REDIS
    REDIS --> EMAILP & WAP & TASKP
    EMAILP --> SMTP
    WAP --> META
    TASKP --> PG
    HTTP --> LOG
    HTTP --> MET
    WEB -->|sube imagen| HTTP -->|upload_stream| CLOUD
```

**Por qué esta forma:** el proceso web nunca espera a un SMTP o a la API
de Meta para responder — encola el trabajo en Redis (BullMQ) y sigue. El
worker que realmente envía los correos/WhatsApp puede correr en el mismo
proceso (`npm run start:prod`, más simple, sirve para el tráfico actual de
una agencia) o separado (`node dist/main.js` con una variable que
deshabilite las rutas HTTP) si el volumen crece — el código no cambia,
solo el comando de arranque.

## Flujo: crear una reserva

```mermaid
sequenceDiagram
    participant C as Cliente (front)
    participant R as ReservasController
    participant S as ReservasService
    participant DB as PostgreSQL
    participant E as EventEmitter2
    participant L as ReservaNotificacionesListener
    participant Q as Cola 'email' (Redis)
    participant W as EmailProcessor
    participant SMTP as SMTP

    C->>R: POST /reservas
    R->>S: create(dto)
    S->>DB: BEGIN + SELECT ... FOR UPDATE (paquete)
    Note over S,DB: Bloquea la fila del paquete para que dos<br/>reservas simultáneas no pasen el mismo último cupo
    S->>DB: SUM(cantidad_personas) reservas activas
    S->>DB: INSERT reserva
    S->>DB: COMMIT
    S->>E: emit('reserva.creada', evento)
    S-->>R: reserva guardada
    R-->>C: 201 Created (ya, sin esperar el correo)
    E-->>L: notifica (async, fuera de la transacción)
    L->>Q: enviarConfirmacionReserva() → queue.add()
    Q-->>W: job tomado por el worker
    W->>SMTP: sendMail()
    Note over W,SMTP: Si falla: 3 reintentos con backoff exponencial.<br/>Si los 3 fallan, la reserva sigue confirmada igual.
```

## Por qué cada pieza

| Pieza | Por qué | Alternativas consideradas |
|---|---|---|
| **Redis + CacheService a mano** (no `@nestjs/cache-manager`) | Una sola conexión compartida con BullMQ, invalidación por prefijo con `SCAN` (no bloquea Redis), cero dependencias de compatibilidad entre versiones de cache-manager y Nest 11. | `@nestjs/cache-manager` + `cache-manager-ioredis-yet`: más "estándar" pero una capa extra de abstracción para lo mismo. |
| **BullMQ** para email/WhatsApp/tareas | Reintentos con backoff, no bloquea la request HTTP, panel de administración disponible (Bull Board) si se quiere agregar después. | `@nestjs/schedule` a secas: sirve para el cron, pero no da reintentos ni desacopla el envío de la request. |
| **Cloudinary** para imágenes | Sin servidor/bucket que administrar, transformación automática (`quality: auto`, `fetch_format: auto`), plan gratis suficiente para el volumen de una agencia. | S3: más control pero hay que resolver policies IAM + un CDN aparte. MinIO: gratis y self-hosted, pero es un servicio más que mantener en el VPS. |
| **`@nestjs/event-emitter`** para reserva/cotización creada | Ya estaba instalado y sin usar. Desacopla "qué pasó" (una reserva se creó) de "qué hacer con eso" (mandar correo hoy; push notification o Slack mañana, sin tocar `ReservasService`). | CQRS completo (`@nestjs/cqrs`): mucho más ceremonia (command bus, handlers, sagas) para un dominio de este tamaño — se puede migrar después si el proyecto crece mucho. |
| **nestjs-pino** | Logs JSON parseables por el proveedor cloud, request-id automático, redacción de campos sensibles (`authorization`, `password`). | Winston: igual de válido; se eligió Pino por menor overhead (usa `pino`, que es más rápido serializando) y por la integración oficial `nestjs-pino`. |
| **Terminus + prom-client** | Terminus es el estándar de Nest para health checks (usado por el healthcheck de Railway/Render). prom-client expone `/metrics` en formato que cualquier Prometheus/Grafana Cloud puede scrapear directo. | Un endpoint `/health` hecho a mano: reinventa lo que Terminus ya resuelve (timeouts, formato de respuesta estándar). |

## Trade-offs conocidos (documentados a propósito, no descubiertos por accidente)

- **Caché de Paquetes/Ofertas**: se invalida por completo (`delByPrefix`)
  en create/update/remove, pero **no** en las operaciones de galería de
  imágenes (agregar/quitar imagen, marcar principal). Esas quedan hasta
  el TTL (5 min en Paquetes, 2 min en Ofertas) desactualizadas en el
  listado público. Se aceptó ese trade-off para no tener que tocar cada
  método de imágenes; si en el futuro se nota, se replica el patrón que
  ya tiene `DestinosService` (que sí invalida en cada método de imagen).
- **`/metrics` sin autenticación**: es lo que esperan los scrapers de
  Prometheus por defecto. No expone datos de negocio, pero si el
  despliegue lo requiere, hay que restringirlo por IP a nivel de
  proxy/load balancer del proveedor cloud (no a nivel de código).
- **Un solo proceso para HTTP + workers** en el arranque por defecto
  (`npm run start:prod`): es lo más simple para el volumen actual. Si las
  colas se saturan (muchos correos/WhatsApp a la vez), separar el worker
  a otro proceso/dyno es un cambio de configuración de despliegue, no de
  código (ver `docs/DESPLIEGUE.md`).
