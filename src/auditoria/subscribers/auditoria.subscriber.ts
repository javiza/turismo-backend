import { Injectable } from '@nestjs/common';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';

import { AuditoriaService } from '../auditoria.service';
import { AccionAuditoria } from '../entities/auditoria.entity';
import { Destino } from '../../destinos/entities/destino.entity';
import { Paquete } from '../../paquetes/entities/paquete.entity';
import { Oferta } from '../../ofertas/entities/oferta.entity';
import { Reserva } from '../../reservas/entities/reserva.entity';
import { User } from '../../users/entities/user.entity';

// Entidades de negocio auditadas. Se guarda el nombre de tabla real
// (no el nombre de la clase) para que quede consistente con la columna
// "tabla" de auditoria y con el resto del schema en español.
const TABLA_POR_ENTIDAD = new Map<Function, string>([
  [Destino, 'destinos'],
  [Paquete, 'paquetes'],
  [Oferta, 'ofertas'],
  [Reserva, 'reservas'],
  [User, 'usuarios'],
]);

/**
 * Auditoría automática: se registra un asiento en "auditoria" cada vez
 * que se inserta, actualiza o elimina una fila de las entidades listadas
 * arriba, sin que cada servicio (Destinos, Paquetes, etc.) tenga que
 * acordarse de llamarlo a mano.
 *
 * Limitación conocida: en UPDATE, TypeORM solo entrega de forma confiable
 * la entidad ya guardada (datos_nuevos). Los valores previos
 * (datos_anteriores) solo se completan si la entidad fue cargada antes
 * del guardado en la misma request (event.databaseEntity) — si no,
 * queda en null. Para reservas/destinos/paquetes esto es aceptable
 * porque igualmente casi todos los flujos de "update" ya hacen un
 * findOne() antes de guardar (ver DestinosService.update, etc.).
 *
 * NOTA sobre usuario_id: los subscribers de TypeORM no tienen acceso al
 * request HTTP (no hay contexto de NestJS acá), así que usuario_id
 * queda sin completar por ahora. Para capturarlo de verdad, la próxima
 * mejora es usar un interceptor + AsyncLocalStorage (o nestjs-cls) que
 * guarde el usuario autenticado en un contexto por-request y este
 * subscriber lo lea de ahí.
 */
@Injectable()
@EventSubscriber()
export class AuditoriaSubscriber implements EntitySubscriberInterface {
  constructor(
    dataSource: DataSource,
    private readonly auditoriaService: AuditoriaService,
  ) {
    dataSource.subscribers.push(this);
  }

  afterInsert(event: InsertEvent<unknown>): void {
    const tabla = this.tablaDe(event.metadata.target);
    if (!tabla) return;

    void this.auditoriaService.registrar({
      tabla,
      accion: AccionAuditoria.INSERT,
      registroId: this.idDe(event.entity),
      datosNuevos: event.entity as Record<string, unknown>,
    });
  }

  afterUpdate(event: UpdateEvent<unknown>): void {
    const tabla = this.tablaDe(event.metadata.target);
    if (!tabla) return;

    void this.auditoriaService.registrar({
      tabla,
      accion: AccionAuditoria.UPDATE,
      registroId: this.idDe(event.entity ?? event.databaseEntity),
      datosAnteriores: event.databaseEntity as
        | Record<string, unknown>
        | undefined,
      datosNuevos: event.entity as Record<string, unknown> | undefined,
    });
  }

  afterRemove(event: RemoveEvent<unknown>): void {
    const tabla = this.tablaDe(event.metadata.target);
    if (!tabla) return;

    void this.auditoriaService.registrar({
      tabla,
      accion: AccionAuditoria.DELETE,
      registroId: this.idDe(event.entity ?? event.databaseEntity),
      datosAnteriores: (event.entity ?? event.databaseEntity) as
        | Record<string, unknown>
        | undefined,
    });
  }

  private tablaDe(target: Function | string): string | undefined {
    return typeof target === 'function' ? TABLA_POR_ENTIDAD.get(target) : undefined;
  }

  private idDe(entity: unknown): number | undefined {
    return (entity as { id?: number } | undefined)?.id;
  }
}
