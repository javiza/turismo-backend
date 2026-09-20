"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditoriaSubscriber = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const auditoria_service_1 = require("../auditoria.service");
const auditoria_entity_1 = require("../entities/auditoria.entity");
const destino_entity_1 = require("../../destinos/entities/destino.entity");
const paquete_entity_1 = require("../../paquetes/entities/paquete.entity");
const oferta_entity_1 = require("../../ofertas/entities/oferta.entity");
const reserva_entity_1 = require("../../reservas/entities/reserva.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const TABLA_POR_ENTIDAD = new Map([
    [destino_entity_1.Destino, 'destinos'],
    [paquete_entity_1.Paquete, 'paquetes'],
    [oferta_entity_1.Oferta, 'ofertas'],
    [reserva_entity_1.Reserva, 'reservas'],
    [user_entity_1.User, 'usuarios'],
]);
let AuditoriaSubscriber = class AuditoriaSubscriber {
    auditoriaService;
    constructor(dataSource, auditoriaService) {
        this.auditoriaService = auditoriaService;
        dataSource.subscribers.push(this);
    }
    afterInsert(event) {
        const tabla = this.tablaDe(event.metadata.target);
        if (!tabla)
            return;
        void this.auditoriaService.registrar({
            tabla,
            accion: auditoria_entity_1.AccionAuditoria.INSERT,
            registroId: this.idDe(event.entity),
            datosNuevos: event.entity,
        });
    }
    afterUpdate(event) {
        const tabla = this.tablaDe(event.metadata.target);
        if (!tabla)
            return;
        void this.auditoriaService.registrar({
            tabla,
            accion: auditoria_entity_1.AccionAuditoria.UPDATE,
            registroId: this.idDe(event.entity ?? event.databaseEntity),
            datosAnteriores: event.databaseEntity,
            datosNuevos: event.entity,
        });
    }
    afterRemove(event) {
        const tabla = this.tablaDe(event.metadata.target);
        if (!tabla)
            return;
        void this.auditoriaService.registrar({
            tabla,
            accion: auditoria_entity_1.AccionAuditoria.DELETE,
            registroId: this.idDe(event.entity ?? event.databaseEntity),
            datosAnteriores: (event.entity ?? event.databaseEntity),
        });
    }
    tablaDe(target) {
        return typeof target === 'function' ? TABLA_POR_ENTIDAD.get(target) : undefined;
    }
    idDe(entity) {
        return entity?.id;
    }
};
exports.AuditoriaSubscriber = AuditoriaSubscriber;
exports.AuditoriaSubscriber = AuditoriaSubscriber = __decorate([
    (0, common_1.Injectable)(),
    (0, typeorm_1.EventSubscriber)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        auditoria_service_1.AuditoriaService])
], AuditoriaSubscriber);
//# sourceMappingURL=auditoria.subscriber.js.map