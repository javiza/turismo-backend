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
exports.UpdateContenidoHomeDto = exports.FUENTES_SLOGAN_KEYS = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
exports.FUENTES_SLOGAN_KEYS = [
    'caveat',
    'dancing-script',
    'pacifico',
    'sacramento',
    'shadows-into-light',
];
class ResenaHomeDto {
    nombre;
    texto;
    valoracion;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], ResenaHomeDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], ResenaHomeDto.prototype, "texto", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], ResenaHomeDto.prototype, "valoracion", void 0);
class UpdateContenidoHomeDto {
    nombreAgencia;
    logoUrl;
    sloganColor;
    sloganFontFamily;
    sloganFontUrl;
    colorFondo;
    colorNavbar;
    colorFooter;
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
}
exports.UpdateContenidoHomeDto = UpdateContenidoHomeDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], UpdateContenidoHomeDto.prototype, "nombreAgencia", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateContenidoHomeDto.prototype, "logoUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
        message: 'sloganColor debe ser un color hexadecimal, ej: #c2410c',
    }),
    __metadata("design:type", String)
], UpdateContenidoHomeDto.prototype, "sloganColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(exports.FUENTES_SLOGAN_KEYS, {
        message: `sloganFontFamily debe ser una de: ${exports.FUENTES_SLOGAN_KEYS.join(', ')}`,
    }),
    __metadata("design:type", String)
], UpdateContenidoHomeDto.prototype, "sloganFontFamily", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateContenidoHomeDto.prototype, "sloganFontUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}))?$/, {
        message: 'colorFondo debe ser un color hexadecimal, ej: #f8fbff',
    }),
    __metadata("design:type", String)
], UpdateContenidoHomeDto.prototype, "colorFondo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}))?$/, {
        message: 'colorNavbar debe ser un color hexadecimal, ej: #f8fbff',
    }),
    __metadata("design:type", String)
], UpdateContenidoHomeDto.prototype, "colorNavbar", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}))?$/, {
        message: 'colorFooter debe ser un color hexadecimal, ej: #f8fbff',
    }),
    __metadata("design:type", String)
], UpdateContenidoHomeDto.prototype, "colorFooter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], UpdateContenidoHomeDto.prototype, "titulo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateContenidoHomeDto.prototype, "subtitulo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], UpdateContenidoHomeDto.prototype, "presentacion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], UpdateContenidoHomeDto.prototype, "mision", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], UpdateContenidoHomeDto.prototype, "vision", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], UpdateContenidoHomeDto.prototype, "valores", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(50),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ResenaHomeDto),
    __metadata("design:type", Array)
], UpdateContenidoHomeDto.prototype, "resenas", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateContenidoHomeDto.prototype, "telefono", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], UpdateContenidoHomeDto.prototype, "correo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], UpdateContenidoHomeDto.prototype, "direccion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateContenidoHomeDto.prototype, "heroImagenUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateContenidoHomeDto.prototype, "heroImagenPosX", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateContenidoHomeDto.prototype, "heroImagenPosY", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    (0, class_validator_1.Max)(300),
    __metadata("design:type", Number)
], UpdateContenidoHomeDto.prototype, "heroImagenZoom", void 0);
//# sourceMappingURL=update-contenido-home.dto.js.map