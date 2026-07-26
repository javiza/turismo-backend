# Guía de despliegue (Railway / Render / similar)

Esta guía asume un proveedor cloud gestionado (Railway, Render, Fly.io),
no un VPS propio. Los pasos son casi idénticos entre proveedores; se
señalan las diferencias donde importan.

## 1. Servicios que necesitas crear

| Servicio | Para qué | Plan gratis suficiente para empezar |
|---|---|---|
| **Web service** (este repo) | La API NestJS | Sí |
| **PostgreSQL** | Base de datos | Sí (Railway/Render dan un plan gratis/starter) |
| **Redis** | Caché + colas BullMQ | Sí |
| **Cuenta Cloudinary** | Almacenamiento de imágenes | Sí (plan gratis: 25 créditos/mes) |
| **Cuenta SMTP** (ej. Resend, Brevo, Gmail con contraseña de app) | Envío de correos | Sí |
| **Meta for Developers app** (opcional) | WhatsApp Business Cloud API | Solo si vas a usar WhatsApp |

## 2. Variables de entorno

Copia `.env.example` como referencia y completa en el panel del proveedor
(Railway: pestaña "Variables"; Render: "Environment"):

- **Base de datos**: la mayoría de los proveedores te dan un botón
  "Add PostgreSQL" que autocompletea `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME`
  (o una sola `DATABASE_URL` — si tu proveedor solo da eso, ajusta
  `src/config/database.config.ts` para leerla, hoy espera variables separadas).
- **Redis**: igual, "Add Redis" te da una `REDIS_URL` (formato
  `redis://default:password@host:puerto`) — cópiala directo a la variable
  `REDIS_URL` del web service. No necesitas configurar `REDIS_HOST/PORT/PASSWORD`
  por separado si usas `REDIS_URL`.
- **Cloudinary**: Dashboard → "API Environment variable" te da los tres
  valores (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)
  listos para copiar.
- **JWT_SECRET / JWT_REFRESH_SECRET / JWT_CLIENTE_SECRET / JWT_CLIENTE_REFRESH_SECRET**:
  generá 4 valores random distintos, por ejemplo:
  ```bash
  openssl rand -base64 48
  ```
- **NODE_ENV=production**: importante — activa logs JSON (en vez de
  pretty-print) y desactiva `synchronize` de TypeORM (ver `database.config.ts`).

## 3. Build y arranque

```bash
# Build
npm ci
npm run build

# Arranque
npm run start:prod
```

Configura esos dos comandos como "Build Command" y "Start Command" en el
panel del proveedor. `start:prod` levanta un solo proceso que atiende
tanto las rutas HTTP como los workers de BullMQ (procesan las colas
`email`, `whatsapp` y `tasks` en el mismo proceso) — es la opción más
simple y correcta para el volumen de tráfico de una agencia de turismo.

### Si el volumen de correos/WhatsApp crece mucho

Separa el worker a un segundo servicio ("Background Worker" en Railway,
"Background Worker" en Render) que corra el mismo build pero solo
procese colas, sin escuchar HTTP. No hay que tocar código: basta con que
ese segundo servicio no reciba tráfico entrante (no necesita dominio
público) — igual va a conectarse a la misma `DATABASE_URL`/`REDIS_URL` y
BullMQ reparte los jobs entre los procesos que estén escuchando esa cola.

## 4. Migraciones de base de datos

Antes del primer deploy (o después de cada cambio de entidades):

```bash
npm run migration:run
```

Corrélo como paso de "Release" / "Pre-deploy command" si tu proveedor lo
soporta (Railway y Render lo tienen), para que corra automáticamente
antes de que el nuevo código reciba tráfico.

## 5. Seed del admin inicial

Una sola vez, después del primer deploy:

```bash
npm run seed
```

Usa `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` / `SEED_ADMIN_NOMBRE` del
entorno. Corrélo desde una shell del proveedor (Railway: `railway run npm run seed`;
Render: "Shell" en el dashboard del servicio) — no lo dejes como parte
del build automático, o se re-ejecutaría en cada deploy.

## 6. Healthcheck del proveedor

Configura el healthcheck del servicio web apuntando a:

```
GET /api/v1/health/readiness
```

Devuelve 200 solo si la API puede conectarse a PostgreSQL y Redis — así
el proveedor no manda tráfico a una instancia que arrancó pero todavía no
puede atender requests reales.

## 7. Verificación post-deploy

```bash
curl https://tu-api.up.railway.app/api/v1/health
curl https://tu-api.up.railway.app/api/v1/metrics
```

El primero debe devolver `"status":"ok"` con el detalle de cada chequeo
(database, redis, memoria, disco). El segundo, métricas en texto plano
formato Prometheus.

## 8. Documentación de la API (Swagger)

Disponible en `/docs` (montado directo por `SwaggerModule.setup('docs', ...)`
en `main.ts` — a diferencia de los controllers, esta ruta **no** lleva el
prefijo `/api/v1`), útil para que el equipo de frontend explore los
endpoints sin este documento.
