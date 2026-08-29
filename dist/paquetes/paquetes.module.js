"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaquetesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const paquetes_service_1 = require("./paquetes.service");
const paquetes_controller_1 = require("./paquetes.controller");
const paquete_entity_1 = require("./entities/paquete.entity");
const paquete_imagen_entity_1 = require("./entities/paquete-imagen.entity");
const destino_imagen_entity_1 = require("../destinos/entities/destino-imagen.entity");
let PaquetesModule = class PaquetesModule {
};
exports.PaquetesModule = PaquetesModule;
exports.PaquetesModule = PaquetesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([paquete_entity_1.Paquete, paquete_imagen_entity_1.PaqueteImagen, destino_imagen_entity_1.DestinoImagen])],
        controllers: [paquetes_controller_1.PaquetesController],
        providers: [paquetes_service_1.PaquetesService],
        exports: [paquetes_service_1.PaquetesService],
    })
], PaquetesModule);
//# sourceMappingURL=paquetes.module.js.map