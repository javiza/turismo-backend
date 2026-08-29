"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlidesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const slides_service_1 = require("./slides.service");
const slides_controller_1 = require("./slides.controller");
const home_slide_entity_1 = require("./entities/home-slide.entity");
const destinos_module_1 = require("../destinos/destinos.module");
const paquetes_module_1 = require("../paquetes/paquetes.module");
const ofertas_module_1 = require("../ofertas/ofertas.module");
const noticias_module_1 = require("../noticias/noticias.module");
let SlidesModule = class SlidesModule {
};
exports.SlidesModule = SlidesModule;
exports.SlidesModule = SlidesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([home_slide_entity_1.HomeSlide]),
            destinos_module_1.DestinosModule,
            paquetes_module_1.PaquetesModule,
            ofertas_module_1.OfertasModule,
            noticias_module_1.NoticiasModule,
        ],
        controllers: [slides_controller_1.SlidesController],
        providers: [slides_service_1.SlidesService],
        exports: [slides_service_1.SlidesService],
    })
], SlidesModule);
//# sourceMappingURL=slides.module.js.map