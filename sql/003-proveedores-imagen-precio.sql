-- Agrega imagen y precio referencial (opcionales) al formulario público
-- de proveedores. El proyecto usa synchronize: false, así que hay que
-- correr esto a mano contra la base de datos.

ALTER TABLE proveedores
  ADD COLUMN IF NOT EXISTS imagen_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS precio_referencial NUMERIC(12, 2) NULL;
