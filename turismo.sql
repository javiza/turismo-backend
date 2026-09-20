-- =========================================================
-- BOOTSTRAP LIMPIO — turismo-backend
-- Para correr UNA SOLA VEZ en una base de datos Render NUEVA (vacía).
-- =========================================================
--
-- Qué hace este script:
--   1) Crea el schema completo del proyecto (tablas, índices,
--      triggers de búsqueda, vistas materializadas y funciones de
--      analytics), tomado de sql/002-paquete-search-trigger.sql
--      de tu repo.
--   2) Registra en la tabla "migrations" de TypeORM las 3
--      migraciones que ese schema ya deja aplicadas, para que
--      `npm run migration:run` no intente recrearlas y siga
--      directo con las 31 migraciones restantes del proyecto
--      (rut, reset password, contactos adicionales, destino_id en
--      cotizaciones, finanzas, proveedores, noticias, home slides,
--      Webpay, configuraciones de integración, etc.).
--
-- Después de correr esto: apunta tu backend (DB_HOST/DB_NAME/etc.
-- en las env vars de Render) a esta base nueva y haz un deploy
-- normal. `npm run migration:run` se encarga del resto.
--
-- Los DROP IF EXISTS al inicio son solo una red de seguridad por si
-- este script se corre más de una vez por error; en una base nueva
-- no deberían tener efecto.
-- =========================================================

BEGIN;

-- ---------------------------------------------------------------
-- 0) Red de seguridad (no-op en una base realmente vacía)
-- ---------------------------------------------------------------
DROP MATERIALIZED VIEW IF EXISTS mv_destinos_populares CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_paquetes_populares CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_ventas_mensuales CASCADE;

DROP TABLE IF EXISTS consultas_email CASCADE;
DROP TABLE IF EXISTS auditoria CASCADE;
DROP TABLE IF EXISTS analytics_eventos CASCADE;
DROP TABLE IF EXISTS visitas CASCADE;
DROP TABLE IF EXISTS mensajes CASCADE;
DROP TABLE IF EXISTS reservas CASCADE;
DROP TABLE IF EXISTS cotizaciones CASCADE;
DROP TABLE IF EXISTS ofertas CASCADE;
DROP TABLE IF EXISTS destino_imagenes CASCADE;
DROP TABLE IF EXISTS destino_categoria CASCADE;
DROP TABLE IF EXISTS paquetes CASCADE;
DROP TABLE IF EXISTS destinos CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

DROP TYPE IF EXISTS consultas_email_estado_enum CASCADE;

-- ---------------------------------------------------------------
-- 1) Schema completo del proyecto
-- ---------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(30) NOT NULL DEFAULT 'ADMIN',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    "hashedRefreshToken" character varying
);

CREATE TABLE categorias (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE TABLE destinos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    pais VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    latitud NUMERIC(10,6),
    longitud NUMERIC(10,6),
    imagen_principal TEXT,
    activo BOOLEAN DEFAULT TRUE,
    search_vector tsvector,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE destino_categoria (
    destino_id BIGINT REFERENCES destinos(id) ON DELETE CASCADE,
    categoria_id BIGINT REFERENCES categorias(id) ON DELETE CASCADE,
    PRIMARY KEY(destino_id,categoria_id)
);

CREATE TABLE destino_imagenes (
    id BIGSERIAL PRIMARY KEY,
    destino_id BIGINT NOT NULL REFERENCES destinos(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE paquetes (
    id BIGSERIAL PRIMARY KEY,
    destino_id BIGINT NOT NULL REFERENCES destinos(id),
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    precio NUMERIC(12,2) NOT NULL,
    cupos INTEGER NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    search_vector tsvector,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ofertas (
    id BIGSERIAL PRIMARY KEY,
    paquete_id BIGINT NOT NULL REFERENCES paquetes(id) ON DELETE CASCADE,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    descuento NUMERIC(5,2) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre character varying(150) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying NOT NULL,
    telefono character varying(50),
    activo boolean NOT NULL DEFAULT true,
    hashed_refresh_token character varying,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "UQ_clientes_email" UNIQUE (email)
);

CREATE TABLE cotizaciones (
    id BIGSERIAL PRIMARY KEY,
    paquete_id BIGINT REFERENCES paquetes(id),
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(50),
    cantidad_personas INTEGER DEFAULT 1,
    mensaje TEXT,
    estado VARCHAR(50) DEFAULT 'PENDIENTE',
    created_at TIMESTAMP DEFAULT NOW(),
    cliente_id integer REFERENCES clientes(id) ON DELETE SET NULL
);

CREATE TABLE reservas (
    id BIGSERIAL PRIMARY KEY,
    paquete_id BIGINT NOT NULL REFERENCES paquetes(id),
    nombre_cliente VARCHAR(150) NOT NULL,
    email_cliente VARCHAR(150),
    telefono VARCHAR(50),
    cantidad_personas INTEGER NOT NULL,
    monto_total NUMERIC(12,2),
    estado VARCHAR(30) DEFAULT 'PENDIENTE',
    fecha_reserva TIMESTAMP DEFAULT NOW(),
    cliente_id integer REFERENCES clientes(id) ON DELETE SET NULL
);

CREATE TABLE mensajes (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    telefono VARCHAR(50),
    asunto VARCHAR(200),
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE visitas (
    id BIGSERIAL PRIMARY KEY,
    destino_id BIGINT REFERENCES destinos(id),
    paquete_id BIGINT REFERENCES paquetes(id),
    ip VARCHAR(100),
    pais VARCHAR(100),
    ciudad VARCHAR(100),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE analytics_eventos (
    id BIGSERIAL PRIMARY KEY,
    tipo_evento VARCHAR(100) NOT NULL,
    destino_id BIGINT REFERENCES destinos(id),
    paquete_id BIGINT REFERENCES paquetes(id),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE auditoria (
    id BIGSERIAL PRIMARY KEY,
    tabla VARCHAR(100),
    accion VARCHAR(50),
    registro_id BIGINT,
    usuario_id BIGINT,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE consultas_email_estado_enum AS ENUM (
    'RESPONDIDA_IA', 'ESCALADA', 'ERROR'
);

CREATE TABLE consultas_email (
    id SERIAL PRIMARY KEY,
    gmail_message_id character varying(100) NOT NULL,
    gmail_thread_id character varying(100) NOT NULL,
    remitente character varying(200) NOT NULL,
    asunto character varying(250),
    cuerpo_original text NOT NULL,
    respuesta text,
    estado consultas_email_estado_enum NOT NULL,
    detalle text,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "UQ_consultas_email_gmail_message_id" UNIQUE (gmail_message_id)
);

-- Índices
CREATE INDEX idx_destino_nombre ON destinos(nombre);
CREATE INDEX idx_destino_pais ON destinos(pais);
CREATE INDEX idx_destino_ciudad ON destinos(ciudad);
CREATE INDEX idx_paquete_nombre ON paquetes(nombre);
CREATE INDEX idx_paquete_precio ON paquetes(precio);
CREATE INDEX idx_paquete_fecha ON paquetes(fecha_inicio, fecha_fin);
CREATE INDEX idx_ofertas_fecha ON ofertas(fecha_inicio, fecha_fin);
CREATE INDEX idx_mensajes_fecha ON mensajes(created_at);
CREATE INDEX idx_reservas_fecha ON reservas(fecha_reserva);
CREATE INDEX idx_visitas_fecha ON visitas(created_at);
CREATE INDEX idx_destino_search ON destinos USING GIN(search_vector);
CREATE INDEX idx_paquete_search ON paquetes USING GIN(search_vector);
CREATE INDEX "IDX_reservas_cliente_id" ON reservas (cliente_id);
CREATE INDEX "IDX_cotizaciones_cliente_id" ON cotizaciones (cliente_id);
CREATE INDEX "IDX_consultas_email_estado" ON consultas_email (estado);

-- Triggers de búsqueda full-text
CREATE OR REPLACE FUNCTION destino_search_trigger()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('spanish', unaccent(
    COALESCE(NEW.nombre,'') || ' ' ||
    COALESCE(NEW.descripcion,'') || ' ' ||
    COALESCE(NEW.pais,'') || ' ' ||
    COALESCE(NEW.ciudad,'')
  ));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_destino_search
BEFORE INSERT OR UPDATE ON destinos
FOR EACH ROW EXECUTE FUNCTION destino_search_trigger();

CREATE OR REPLACE FUNCTION paquete_search_trigger()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('spanish', unaccent(
    COALESCE(NEW.nombre,'') || ' ' ||
    COALESCE(NEW.descripcion,'')
  ));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_paquete_search
BEFORE INSERT OR UPDATE ON paquetes
FOR EACH ROW EXECUTE FUNCTION paquete_search_trigger();

-- Vistas materializadas y funciones de analytics
CREATE MATERIALIZED VIEW mv_destinos_populares AS
SELECT d.id, d.nombre, COUNT(v.id) total_visitas
FROM destinos d
LEFT JOIN visitas v ON d.id = v.destino_id
GROUP BY d.id, d.nombre;

CREATE MATERIALIZED VIEW mv_paquetes_populares AS
SELECT p.id, p.nombre, COUNT(v.id) total_visitas
FROM paquetes p
LEFT JOIN visitas v ON p.id = v.paquete_id
GROUP BY p.id, p.nombre;

CREATE MATERIALIZED VIEW mv_ventas_mensuales AS
SELECT DATE_TRUNC('month', fecha_reserva) mes, COUNT(*) reservas, SUM(monto_total) ingresos
FROM reservas
GROUP BY 1;

REFRESH MATERIALIZED VIEW mv_destinos_populares;
REFRESH MATERIALIZED VIEW mv_paquetes_populares;
REFRESH MATERIALIZED VIEW mv_ventas_mensuales;

CREATE OR REPLACE FUNCTION top_destinos()
RETURNS TABLE(id BIGINT, nombre VARCHAR, visitas BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT d.id, d.nombre, COUNT(v.id)
  FROM destinos d
  LEFT JOIN visitas v ON d.id = v.destino_id
  GROUP BY d.id, d.nombre
  ORDER BY COUNT(v.id) DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION top_paquetes()
RETURNS TABLE(id BIGINT, nombre VARCHAR, visitas BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.nombre, COUNT(v.id)
  FROM paquetes p
  LEFT JOIN visitas v ON p.id = v.paquete_id
  GROUP BY p.id, p.nombre
  ORDER BY COUNT(v.id) DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION tendencia_mensual()
RETURNS TABLE(mes TEXT, visitas BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT TO_CHAR(created_at,'YYYY-MM'), COUNT(*)
  FROM visitas
  GROUP BY 1
  ORDER BY 1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION dashboard_general()
RETURNS JSON AS $$
DECLARE
  resultado JSON;
BEGIN
  SELECT json_build_object(
    'total_destinos', (SELECT COUNT(*) FROM destinos),
    'total_paquetes', (SELECT COUNT(*) FROM paquetes),
    'total_ofertas', (SELECT COUNT(*) FROM ofertas),
    'total_mensajes', (SELECT COUNT(*) FROM mensajes),
    'total_reservas', (SELECT COUNT(*) FROM reservas),
    'total_visitas', (SELECT COUNT(*) FROM visitas)
  ) INTO resultado;
  RETURN resultado;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------
-- 2) Registrar como ya ejecutadas las 3 migraciones que este
--    schema completo ya deja aplicadas
-- ---------------------------------------------------------------

CREATE TABLE IF NOT EXISTS migrations (
  id SERIAL PRIMARY KEY,
  timestamp bigint NOT NULL,
  name character varying NOT NULL
);

INSERT INTO migrations (timestamp, name) VALUES
  (1783871828928, 'AddHashedRefreshTokenToUsuarios1783871828928'),
  (1783872261563, 'CreateConsultasEmail1783872261563'),
  (1783892461295, 'CreateClientes1783892461295');

COMMIT;

-- =========================================================
-- SIGUIENTE PASO
-- Apunta el backend (variables DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/
-- DB_NAME/DB_SSL en Render) a esta base nueva y haz un deploy.
-- `npm run migration:run` va a ver 3 migraciones ya cargadas y 31
-- pendientes, y va a aplicar esas 31 sobre este schema recién
-- creado, sin choques.
-- =========================================================
