import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

export interface ContextoCatalogo {
  paquetes: Array<{
    nombre: string;
    destino: string;
    precio: number;
    cupos: number;
    fechaInicio: string;
    fechaFin: string;
  }>;
  ofertas: Array<{ nombre: string; descuento: number; vigenciaFin: string }>;
}

export type ResultadoIa =
  | { confianza: 'alta'; respuesta: string }
  | { confianza: 'baja'; motivo: string };

/**
 * Usa Claude para dos cosas, en una sola llamada:
 *   1. Decidir si la consulta del cliente es "simple" (se puede responder
 *      solo con el catálogo de paquetes/ofertas vigente: precio, fechas,
 *      cupos, destinos disponibles).
 *   2. Si es simple, redactar la respuesta.
 *
 * A propósito NO se le pide a la IA que responda TODO. Preguntas sobre
 * reservas ya hechas, reclamos, pagos, casos particulares o cualquier cosa
 * fuera del catálogo se marcan como confianza "baja" y se escalan a una
 * persona — mandar una respuesta automática incorrecta sobre plata o una
 * reserva es peor que no responder.
 *
 * Modelo: claude-haiku-4-5. Es la elección correcta acá por costo y
 * velocidad: la tarea es clasificar + redactar una respuesta corta a
 * partir de datos ya estructurados, no requiere razonamiento profundo.
 */
@Injectable()
export class IaService {
  private readonly logger = new Logger(IaService.name);
  private readonly client: Anthropic | null;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('ANTHROPIC_API_KEY');

    if (!apiKey) {
      this.logger.warn(
        'ANTHROPIC_API_KEY no configurada. El asistente de correo no podrá generar respuestas.',
      );
      this.client = null;
      return;
    }

    this.client = new Anthropic({ apiKey });
  }

  estaActivo(): boolean {
    return this.client !== null;
  }

  async responderConsulta(
    pregunta: string,
    contexto: ContextoCatalogo,
  ): Promise<ResultadoIa> {
    if (!this.client) {
      return { confianza: 'baja', motivo: 'IA no configurada' };
    }

    const systemPrompt = `Eres el asistente de correo de una agencia de turismo chilena.
Tu única función es leer la consulta de un cliente y decidir si se puede
responder con certeza usando SOLO los datos de catálogo entregados abajo.

Responde EXCLUSIVAMENTE en JSON, sin texto adicional, con esta forma:
{"confianza": "alta", "respuesta": "..."} si puedes responder con certeza
{"confianza": "baja", "motivo": "..."} si no puedes

Marca "baja" siempre que la consulta trate sobre: una reserva ya realizada,
pagos o reembolsos, reclamos, datos personales, disponibilidad no listada
en el catálogo, o cualquier cosa ambigua. Marca "baja" también si el
catálogo no tiene la información para responder con exactitud — NUNCA
inventes precios, fechas o cupos.

Si marcas "alta", la respuesta debe ser breve, cordial, en español de
Chile, firmada como "Equipo de reservas".

Catálogo vigente (JSON): ${JSON.stringify(contexto)}`;

    try {
      const mensaje = await this.client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: systemPrompt,
        messages: [{ role: 'user', content: pregunta }],
      });

      const bloqueTexto = mensaje.content.find((b) => b.type === 'text');
      if (!bloqueTexto || bloqueTexto.type !== 'text') {
        return { confianza: 'baja', motivo: 'Respuesta de IA sin texto' };
      }

      return this.parsearRespuesta(bloqueTexto.text);
    } catch (error) {
      this.logger.error(
        `Error llamando a la API de Anthropic: ${(error as Error).message}`,
      );
      return { confianza: 'baja', motivo: 'Error al consultar la IA' };
    }
  }

  private parsearRespuesta(texto: string): ResultadoIa {
    try {
      // Por si el modelo envuelve el JSON en ```json ... ``` a pesar de la instrucción.
      const limpio = texto.replace(/```json|```/g, '').trim();
      const parseado = JSON.parse(limpio) as ResultadoIa;

      if (
        parseado.confianza === 'alta' &&
        typeof parseado.respuesta === 'string' &&
        parseado.respuesta.length > 0
      ) {
        return parseado;
      }

      if (parseado.confianza === 'baja') {
        return {
          confianza: 'baja',
          motivo: parseado.motivo ?? 'Sin motivo especificado',
        };
      }

      return { confianza: 'baja', motivo: 'JSON de IA con forma inesperada' };
    } catch {
      return {
        confianza: 'baja',
        motivo: 'No se pudo interpretar la respuesta de la IA',
      };
    }
  }
}
