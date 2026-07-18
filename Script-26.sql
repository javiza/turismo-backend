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
    updated_at TIMESTAMP DEFAULT NOW()
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

    destino_id BIGINT NOT NULL
    REFERENCES destinos(id)
    ON DELETE CASCADE,

    url TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE paquetes (
    id BIGSERIAL PRIMARY KEY,

    destino_id BIGINT NOT NULL
    REFERENCES destinos(id),

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

    paquete_id BIGINT NOT NULL
    REFERENCES paquetes(id)
    ON DELETE CASCADE,

    titulo VARCHAR(200) NOT NULL,

    descripcion TEXT,

    descuento NUMERIC(5,2) NOT NULL,

    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,

    activa BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE cotizaciones (
    id BIGSERIAL PRIMARY KEY,

    paquete_id BIGINT
    REFERENCES paquetes(id),

    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(50),

    cantidad_personas INTEGER DEFAULT 1,

    mensaje TEXT,

    estado VARCHAR(50) DEFAULT 'PENDIENTE',

    created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE reservas (
    id BIGSERIAL PRIMARY KEY,

    paquete_id BIGINT NOT NULL
    REFERENCES paquetes(id),

    nombre_cliente VARCHAR(150) NOT NULL,

    email_cliente VARCHAR(150),

    telefono VARCHAR(50),

    cantidad_personas INTEGER NOT NULL,

    monto_total NUMERIC(12,2),

    estado VARCHAR(30) DEFAULT 'PENDIENTE',

    fecha_reserva TIMESTAMP DEFAULT NOW()
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


CREATE INDEX idx_destino_nombre
ON destinos(nombre);

CREATE INDEX idx_destino_pais
ON destinos(pais);

CREATE INDEX idx_destino_ciudad
ON destinos(ciudad);

CREATE INDEX idx_paquete_nombre
ON paquetes(nombre);

CREATE INDEX idx_paquete_precio
ON paquetes(precio);

CREATE INDEX idx_paquete_fecha
ON paquetes(fecha_inicio, fecha_fin);

CREATE INDEX idx_ofertas_fecha
ON ofertas(fecha_inicio, fecha_fin);

CREATE INDEX idx_mensajes_fecha
ON mensajes(created_at);

CREATE INDEX idx_reservas_fecha
ON reservas(fecha_reserva);

CREATE INDEX idx_visitas_fecha
ON visitas(created_at);

CREATE INDEX idx_destino_search
ON destinos
USING GIN(search_vector);

CREATE INDEX idx_paquete_search
ON paquetes
USING GIN(search_vector);


CREATE OR REPLACE FUNCTION destino_search_trigger()
RETURNS trigger AS
$$
BEGIN

NEW.search_vector :=
to_tsvector(
'spanish',
unaccent(
COALESCE(NEW.nombre,'') || ' ' ||
COALESCE(NEW.descripcion,'') || ' ' ||
COALESCE(NEW.pais,'') || ' ' ||
COALESCE(NEW.ciudad,'')
)
);

RETURN NEW;

END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_destino_search
BEFORE INSERT OR UPDATE
ON destinos
FOR EACH ROW
EXECUTE FUNCTION destino_search_trigger();



CREATE MATERIALIZED VIEW mv_destinos_populares AS

SELECT
d.id,
d.nombre,
COUNT(v.id) total_visitas

FROM destinos d

LEFT JOIN visitas v
ON d.id = v.destino_id

GROUP BY d.id,d.nombre;


CREATE MATERIALIZED VIEW mv_paquetes_populares AS

SELECT
p.id,
p.nombre,
COUNT(v.id) total_visitas

FROM paquetes p

LEFT JOIN visitas v
ON p.id = v.paquete_id

GROUP BY p.id,p.nombre;

CREATE MATERIALIZED VIEW mv_ventas_mensuales AS

SELECT
DATE_TRUNC('month',fecha_reserva) mes,
COUNT(*) reservas,
SUM(monto_total) ingresos

FROM reservas

GROUP BY 1;

REFRESH MATERIALIZED VIEW mv_destinos_populares;

REFRESH MATERIALIZED VIEW mv_paquetes_populares;

REFRESH MATERIALIZED VIEW mv_ventas_mensuales;

CREATE OR REPLACE FUNCTION top_destinos()
RETURNS TABLE(
id BIGINT,
nombre VARCHAR,
visitas BIGINT
)
AS
$$
BEGIN

RETURN QUERY

SELECT
d.id,
d.nombre,
COUNT(v.id)

FROM destinos d

LEFT JOIN visitas v
ON d.id=v.destino_id

GROUP BY d.id,d.nombre

ORDER BY COUNT(v.id) DESC

LIMIT 10;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION top_paquetes()
RETURNS TABLE(
id BIGINT,
nombre VARCHAR,
visitas BIGINT
)
AS
$$
BEGIN

RETURN QUERY

SELECT
p.id,
p.nombre,
COUNT(v.id)

FROM paquetes p

LEFT JOIN visitas v
ON p.id=v.paquete_id

GROUP BY p.id,p.nombre

ORDER BY COUNT(v.id) DESC

LIMIT 10;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION tendencia_mensual()
RETURNS TABLE(
mes TEXT,
visitas BIGINT
)
AS
$$
BEGIN

RETURN QUERY

SELECT
TO_CHAR(created_at,'YYYY-MM'),
COUNT(*)

FROM visitas

GROUP BY 1

ORDER BY 1;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION dashboard_general()
RETURNS JSON
AS
$$
DECLARE
resultado JSON;
BEGIN

SELECT json_build_object(

'total_destinos',
(SELECT COUNT(*) FROM destinos),

'total_paquetes',
(SELECT COUNT(*) FROM paquetes),

'total_ofertas',
(SELECT COUNT(*) FROM ofertas),

'total_mensajes',
(SELECT COUNT(*) FROM mensajes),

'total_reservas',
(SELECT COUNT(*) FROM reservas),

'total_visitas',
(SELECT COUNT(*) FROM visitas)

)

INTO resultado;

RETURN resultado;

END;
$$ LANGUAGE plpgsql;

