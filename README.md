# Turismo — API Backend

API REST en NestJS para una agencia de turismo: catálogo de destinos,
paquetes y ofertas, reservas, cotizaciones, mensajes de contacto,
clientes y panel admin.

## Stack

NestJS 11 · TypeORM · PostgreSQL · Redis (caché + BullMQ) · Cloudinary ·
Pino (logs) · Terminus + prom-client (salud/métricas) · JWT (admin y
clientes por separado) · Swagger.

## Arranque local

```bash
npm install
cp .env.example .env   # completa los valores (ver docs/DESPLIEGUE.md)
npm run migration:run
npm run seed            # crea el admin inicial
npm run start:dev
```

Necesitas PostgreSQL y Redis corriendo localmente (o apuntar `.env` a
instancias remotas). Si dejas `SMTP_*`, `WHATSAPP_*` o `CLOUDINARY_*`
vacíos, esos servicios quedan en modo simulado (solo loguean) — útil para
desarrollar sin credenciales reales.

- API: `http://localhost:3000/api/v1`
- Docs (Swagger): `http://localhost:3000/docs`
- Salud: `http://localhost:3000/api/v1/health`
- Métricas (Prometheus): `http://localhost:3000/api/v1/metrics`

## Tests

```bash
npm run test        # unitarios
npm run test:cov     # con reporte de cobertura
npm run test:e2e     # end-to-end
```

## Documentación técnica

- **[docs/ARQUITECTURA.md](docs/ARQUITECTURA.md)** — diagramas (Mermaid),
  qué hace cada pieza de infraestructura y por qué, trade-offs conocidos.
- **[docs/DESPLIEGUE.md](docs/DESPLIEGUE.md)** — guía paso a paso para
  desplegar en Railway/Render (u otro cloud gestionado): variables de
  entorno, build/start, migraciones, seed, healthcheck.

## Infraestructura de nivel producción

Además del CRUD del catálogo y las reservas, el backend incluye:

| Pieza | Dónde |
|---|---|
| Caché de aplicación (Redis) | `src/redis/` — aplicado en Destinos, Categorías, Paquetes, Ofertas |
| Almacenamiento de imágenes (Cloudinary) | `src/storage/` — `POST /uploads/imagenes/:carpeta` |
| Colas en segundo plano (BullMQ) | `src/email/`, `src/whatsapp/`, `src/queue/` — envío de correos/WhatsApp con reintentos, sin bloquear la request |
| Eventos de dominio | `src/common/events/`, listeners en `src/reservas/listeners/` y `src/cotizaciones/listeners/` |
| Logging estructurado | `src/logging/` (Pino, JSON en producción) |
| Health checks | `src/health/` (`/health`, `/health/liveness`, `/health/readiness`) |
| Métricas Prometheus | `src/metrics/` (`/metrics`) |
| Tests | `**/*.spec.ts` junto a cada módulo, con repositorios/servicios mockeados |

## Scripts útiles

```bash
npm run migration:generate   # genera una migración a partir de cambios en entidades
npm run migration:run        # aplica migraciones pendientes
npm run reset-admin-password # resetea la contraseña del admin (recuperación de emergencia)
```
