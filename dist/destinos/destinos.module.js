"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DestinosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const destinos_service_1 = require("./destinos.service");
const destinos_controller_1 = require("./destinos.controller");
const destino_entity_1 = require("./entities/destino.entity");
const destino_imagen_entity_1 = require("./entities/destino-imagen.entity");
const categoria_entity_1 = require("../categorias/entities/categoria.entity");
let DestinosModule = class DestinosModule {
};
exports.DestinosModule = DestinosModule;
exports.DestinosModule = DestinosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([destino_entity_1.Destino, destino_imagen_entity_1.DestinoImagen, categoria_entity_1.Categoria])],
        controllers: [destinos_controller_1.DestinosController],
        providers: [destinos_service_1.DestinosService],
        exports: [destinos_service_1.DestinosService],
    })
], DestinosModule);
//# sourceMappingURL=destinos.module.js.map