"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfertasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ofertas_service_1 = require("./ofertas.service");
const ofertas_controller_1 = require("./ofertas.controller");
const oferta_entity_1 = require("./entities/oferta.entity");
const oferta_imagen_entity_1 = require("./entities/oferta-imagen.entity");
const paquete_entity_1 = require("../paquetes/entities/paquete.entity");
const paquete_imagen_entity_1 = require("../paquetes/entities/paquete-imagen.entity");
const destino_imagen_entity_1 = require("../destinos/entities/destino-imagen.entity");
let OfertasModule = class OfertasModule {
};
exports.OfertasModule = OfertasModule;
exports.OfertasModule = OfertasModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                oferta_entity_1.Oferta,
                oferta_imagen_entity_1.OfertaImagen,
                paquete_entity_1.Paquete,
                paquete_imagen_entity_1.PaqueteImagen,
                destino_imagen_entity_1.DestinoImagen,
            ]),
        ],
        controllers: [ofertas_controller_1.OfertasController],
        providers: [ofertas_service_1.OfertasService],
        exports: [ofertas_service_1.OfertasService],
    })
], OfertasModule);
//# sourceMappingURL=ofertas.module.js.map