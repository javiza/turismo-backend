# JSON de prueba para Swagger (`/docs`)

Todos los endpoints usan el prefijo global `api/v1` (ej. la ruta real de
`POST /auth/login` es `POST /api/v1/auth/login`). En Swagger no hace falta
escribir el prefijo, ya viene armado en cada "Try it out".

Orden sugerido para probar de punta a punta: **login → destinos → paquetes
→ ofertas → reservas/cotizaciones/mensajes**. Los endpoints marcados 🔒
necesitan `Authorize` en Swagger (botón candado, arriba a la derecha) con
el `access_token` que te devuelve el login.

---

## Auth

### POST /auth/login
```json
{
  "email": "admin@turismo.cl",
  "password": "12345678"
}
```
Usa el mismo email/password que pusiste en `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` del `.env` al correr `npm run seed`. Devuelve
`access_token` y `refresh_token`.

### GET /auth/profile 🔒
Sin body, solo el token.

### POST /auth/refresh
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```
Pegá acá el `refresh_token` (no el `access_token`) que te dio el login.
Devuelve un `access_token` Y un `refresh_token` **nuevos** — rotación: el
refresh token que usaste queda inválido, guardá el nuevo si vas a seguir
probando refreshes.

### POST /auth/logout 🔒
Sin body, solo el token. Invalida la sesión: un `POST /auth/refresh`
posterior con el refresh token de esa sesión va a devolver 401.

---

## Clientes Auth (público, sin login previo)

### POST /clientes-auth/registro
```json
{
  "nombre": "Juan Pérez",
  "email": "juan.perez@example.com",
  "password": "12345678",
  "telefono": "+56912345678"
}
```

### POST /clientes-auth/login
```json
{
  "email": "juan.perez@example.com",
  "password": "12345678"
}
```

### POST /clientes-auth/refresh
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```
Mismo criterio que `/auth/refresh`: rotación, el token usado queda inválido.

### POST /clientes-auth/logout 🔒 (JWT-cliente)
Sin body, solo el token de cliente (no el de admin — son sesiones separadas).

### GET /clientes-auth/perfil 🔒 (JWT-cliente)
### GET /clientes-auth/mis-reservas 🔒 (JWT-cliente)
### GET /clientes-auth/mis-cotizaciones 🔒 (JWT-cliente)
Los tres sin body, solo el token de cliente.

---

## Users 🔒 (todos requieren SUPER_ADMIN, salvo que se indique otro rol)

### POST /users
```json
{
  "nombre": "Nueva Admin",
  "email": "nueva.admin@turismo.com",
  "password": "12345678",
  "rol": "ADMIN"
}
```
`rol` es opcional (`ADMIN` | `SUPER_ADMIN`, default `ADMIN`).

### PATCH /users/:id/deactivate
Sin body.

---

## Destinos

### POST /destinos 🔒
```json
{
  "nombre": "San Pedro de Atacama",
  "descripcion": "Pueblo en el desierto más árido del mundo, base para excursiones a salares, géiseres y valles.",
  "pais": "Chile",
  "ciudad": "San Pedro de Atacama",
  "latitud": -22.9098,
  "longitud": -68.1997,
  "imagenPrincipal": "https://ejemplo.com/imagenes/atacama.jpg"
}
```

### PATCH /destinos/:id 🔒
```json
{
  "descripcion": "Descripción actualizada del destino.",
  "activo": true
}
```

### POST /destinos/:id/imagenes 🔒
```json
{
  "url": "https://ejemplo.com/imagenes/atacama-2.jpg"
}
```

### GET /destinos/buscar?q=atacama
Query param, sin body.

---

## Paquetes

### POST /paquetes 🔒
```json
{
  "destinoId": 1,
  "nombre": "Atacama Completo 4D/3N",
  "descripcion": "Tour de 4 días incluyendo Valle de la Luna, Salar de Atacama, géiseres del Tatio y Laguna Cejar.",
  "precio": 350000,
  "cupos": 20,
  "fechaInicio": "2026-09-15",
  "fechaFin": "2026-09-18"
}
```

### PATCH /paquetes/:id 🔒
```json
{
  "precio": 320000,
  "cupos": 15,
  "activo": true
}
```

### GET /paquetes/buscar?q=atacama
Query param (usa el trigger de búsqueda de `sql/002-paquete-search-trigger.sql`), sin body.

---

## Ofertas

### POST /ofertas 🔒
```json
{
  "paqueteId": 1,
  "titulo": "20% OFF Atacama - Cyber Days",
  "descripcion": "Válido solo para reservas hechas durante la promoción.",
  "descuento": 20,
  "fechaInicio": "2026-07-15",
  "fechaFin": "2026-07-20"
}
```

### PATCH /ofertas/:id 🔒
```json
{
  "descuento": 15,
  "activa": false
}
```

---

## Categorías

### POST /categorias 🔒
```json
{
  "nombre": "Aventura",
  "descripcion": "Destinos orientados a actividades outdoor y deportes de aventura."
}
```

### PATCH /categorias/:id 🔒
```json
{
  "nombre": "Aventura y Trekking"
}
```

### Asociar categoría a un destino
`POST /destinos/:id/categorias/:categoriaId` — sin body, ambos ids van en la URL.

---

## Reservas (público, sin login)

### POST /reservas
```json
{
  "paqueteId": 1,
  "nombreCliente": "Juan Pérez",
  "emailCliente": "juan.perez@example.com",
  "telefono": "+56912345678",
  "cantidadPersonas": 2
}
```

### PATCH /reservas/:id/estado 🔒
```json
{
  "estado": "CONFIRMADA"
}
```
Valores válidos de `estado`: revisa el enum `EstadoReserva` en
`src/reservas/entities/reserva.entity.ts` (típicamente
`PENDIENTE` | `CONFIRMADA` | `CANCELADA`).

---

## Cotizaciones (público, sin login)

### POST /cotizaciones
```json
{
  "paqueteId": 1,
  "nombre": "María González",
  "email": "maria.gonzalez@example.com",
  "telefono": "+56987654321",
  "cantidadPersonas": 4,
  "mensaje": "Quisiéramos cotizar para viajar en septiembre, ¿tienen descuento por grupo?"
}
```

### PATCH /cotizaciones/:id/estado 🔒
```json
{
  "estado": "RESPONDIDA"
}
```
Valores válidos: `PENDIENTE` | `RESPONDIDA` | `CERRADA` (enum `EstadoCotizacion`).

---

## Mensajes de contacto (público, sin login)

### POST /mensajes
```json
{
  "nombre": "Carla Soto",
  "correo": "carla.soto@example.com",
  "telefono": "+56911223344",
  "asunto": "Consulta por disponibilidad",
  "mensaje": "Hola, ¿tienen paquetes disponibles para la primera semana de octubre a Atacama?"
}
```

### PATCH /mensajes/:id 🔒
```json
{
  "leido": true
}
```

---

## Analytics

### POST /analytics/eventos
```json
{
  "tipoEvento": "VISTA_PAQUETE",
  "paqueteId": 1,
  "metadata": {
    "origen": "landing_instagram"
  }
}
```
`destinoId`, `paqueteId` y `metadata` son todos opcionales — mandá solo los
que correspondan al evento que estás registrando.

### POST /analytics/refrescar-vistas 🔒
Sin body.

---

## Visitas (público, sin login)

### POST /visitas
```json
{
  "destinoId": 1
}
```
o, si es la ficha de un paquete:
```json
{
  "paqueteId": 1
}
```
No mandes `ip` ni `user_agent`: el propio backend los toma del request, no
del body (ver el comentario en `CreateVisitaDto`).

---

## Asistente IA de correo 🔒 (solo lectura, sin body)

- `GET /asistente-ia/consultas` — historial completo.
- `GET /asistente-ia/consultas/pendientes` — solo las escaladas o con error.

---

## Notas rápidas para probar en Swagger

1. Corré `POST /auth/login` primero, copiá el `access_token` de la respuesta.
2. Click en **Authorize** (candado arriba a la derecha) → pegá el token
   (sin la palabra `Bearer`, Swagger la agrega solo) → **Authorize**.
3. Los endpoints 🔒 ahora van a mandar el header automáticamente.
4. Si un endpoint devuelve 401 después de un rato, tu access token expiró
   (`JWT_ACCESS_EXPIRES` en `.env`, default `15m`) — logueate de nuevo.
5. Para probar el fix del bug de usuario desactivado: desactivá un usuario
   con `PATCH /users/:id/deactivate`, y con ESE usuario logueado, cualquier
   endpoint 🔒 debería devolver 401 "Usuario no válido o deshabilitado" en
   la siguiente request, aunque el token todavía no haya expirado.
