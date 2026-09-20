import { DataSource, EntitySubscriberInterface, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';
import { AuditoriaService } from '../auditoria.service';
export declare class AuditoriaSubscriber implements EntitySubscriberInterface {
    private readonly auditoriaService;
    constructor(dataSource: DataSource, auditoriaService: AuditoriaService);
    afterInsert(event: InsertEvent<unknown>): void;
    afterUpdate(event: UpdateEvent<unknown>): void;
    afterRemove(event: RemoveEvent<unknown>): void;
    private tablaDe;
    private idDe;
}
