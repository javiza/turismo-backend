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
exports.ContenidoHome = void 0;
const typeorm_1 = require("typeorm");
let ContenidoHome = class ContenidoHome {
    id;
    nombreAgencia;
    logoUrl;
    sloganColor;
    sloganFontFamily;
    sloganFontUrl;
    colorFondo;
    colorNavbar;
    titulo;
    subtitulo;
    presentacion;
    mision;
    vision;
    valores;
    resenas;
    telefono;
    correo;
    direccion;
    heroImagenUrl;
    heroImagenPosX;
    heroImagenPosY;
    heroImagenZoom;
    updatedAt;
};
exports.ContenidoHome = ContenidoHome;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ default: 1 }),
    __metadata("design:type", Number)
], ContenidoHome.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'nombre_agencia', default: 'Tu Agencia de Viajes' }),
    __metadata("design:type", String)
], ContenidoHome.prototype, "nombreAgencia", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'logo_url', nullable: true }),
    __metadata("design:type", Object)
], ContenidoHome.prototype, "logoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'slogan_color', default: '#c2410c' }),
    __metadata("design:type", String)
], ContenidoHome.prototype, "sloganColor", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'slogan_font_family', default: 'caveat' }),
    __metadata("design:type", String)
], ContenidoHome.prototype, "sloganFontFamily", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'slogan_font_url', nullable: true }),
    __metadata("design:type", Object)
], ContenidoHome.prototype, "sloganFontUrl", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'color_fondo', nullable: true }),
    __metadata("design:type", Object)
], ContenidoHome.prototype, "colorFondo", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'color_navbar', nullable: true }),
    __metadata("design:type", Object)
], ContenidoHome.prototype, "colorNavbar", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ContenidoHome.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { default: '' }),
    __metadata("design:type", String)
], ContenidoHome.prototype, "subtitulo", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ContenidoHome.prototype, "presentacion", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ContenidoHome.prototype, "mision", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ContenidoHome.prototype, "vision", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ContenidoHome.prototype, "valores", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { default: () => "'[]'" }),
    __metadata("design:type", Array)
], ContenidoHome.prototype, "resenas", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", Object)
], ContenidoHome.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", Object)
], ContenidoHome.prototype, "correo", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", Object)
], ContenidoHome.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'hero_imagen_url', nullable: true }),
    __metadata("design:type", Object)
], ContenidoHome.prototype, "heroImagenUrl", void 0);
__decorate([
    (0, typeorm_1.Column)('float', { name: 'hero_imagen_pos_x', default: 50 }),
    __metadata("design:type", Number)
], ContenidoHome.prototype, "heroImagenPosX", void 0);
__decorate([
    (0, typeorm_1.Column)('float', { name: 'hero_imagen_pos_y', default: 50 }),
    __metadata("design:type", Number)
], ContenidoHome.prototype, "heroImagenPosY", void 0);
__decorate([
    (0, typeorm_1.Column)('float', { name: 'hero_imagen_zoom', default: 100 }),
    __metadata("design:type", Number)
], ContenidoHome.prototype, "heroImagenZoom", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ContenidoHome.prototype, "updatedAt", void 0);
exports.ContenidoHome = ContenidoHome = __decorate([
    (0, typeorm_1.Entity)('contenido_home')
], ContenidoHome);
//# sourceMappingURL=contenido-home.entity.js.map