"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsistenteIaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const gmail_service_1 = require("./gmail.service");
const ia_service_1 = require("./ia.service");
const consultas_ia_service_1 = require("./consultas-ia.service");
const consultas_ia_controller_1 = require("./consultas-ia.controller");
const consulta_email_entity_1 = require("./entities/consulta-email.entity");
const paquete_entity_1 = require("../paquetes/entities/paquete.entity");
const oferta_entity_1 = require("../ofertas/entities/oferta.entity");
const email_module_1 = require("../email/email.module");
let AsistenteIaModule = class AsistenteIaModule {
};
exports.AsistenteIaModule = AsistenteIaModule;
exports.AsistenteIaModule = AsistenteIaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([consulta_email_entity_1.ConsultaEmail, paquete_entity_1.Paquete, oferta_entity_1.Oferta]),
            email_module_1.EmailModule,
        ],
        controllers: [consultas_ia_controller_1.ConsultasIaController],
        providers: [gmail_service_1.GmailService, ia_service_1.IaService, consultas_ia_service_1.ConsultasIaService],
        exports: [consultas_ia_service_1.ConsultasIaService],
    })
], AsistenteIaModule);
//# sourceMappingURL=asistente-ia.module.js.map