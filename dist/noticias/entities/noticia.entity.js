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
exports.Noticia = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let Noticia = class Noticia {
    id;
    titulo;
    contenido;
    imagenUrl;
    activa;
    autorId;
    autor;
    createdAt;
    updatedAt;
};
exports.Noticia = Noticia;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Noticia.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Noticia.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Noticia.prototype, "contenido", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'imagen_url', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Noticia.prototype, "imagenUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Noticia.prototype, "activa", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'autor_id', nullable: true }),
    __metadata("design:type", Number)
], Noticia.prototype, "autorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'autor_id' }),
    __metadata("design:type", user_entity_1.User)
], Noticia.prototype, "autor", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Noticia.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Noticia.prototype, "updatedAt", void 0);
exports.Noticia = Noticia = __decorate([
    (0, typeorm_1.Entity)('noticias')
], Noticia);
//# sourceMappingURL=noticia.entity.js.map