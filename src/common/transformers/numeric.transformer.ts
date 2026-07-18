import { ValueTransformer } from 'typeorm';

/**
 * Postgres/node-pg devuelve las columnas NUMERIC/DECIMAL como string
 * (para no perder precisión), pero TypeORM no las convierte solo.
 * Este transformer las deja como number al leer, y las deja pasar tal
 * cual al escribir.
 *
 * Nota: para montos de dinero muy grandes o cálculos acumulados
 * repetidos, valorar mantenerlos como string y usar una librería
 * decimal (p.ej. decimal.js) en vez de number, por precisión de punto
 * flotante. Para precios de paquetes turísticos esto es suficiente.
 */
export const numericTransformer: ValueTransformer = {
  to: (value?: number | string) => value,
  from: (value?: string | null) =>
    value === null || value === undefined ? value : parseFloat(value),
};
