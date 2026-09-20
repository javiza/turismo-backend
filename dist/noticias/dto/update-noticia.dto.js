"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNoticiaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_noticia_dto_1 = require("./create-noticia.dto");
class UpdateNoticiaDto extends (0, swagger_1.PartialType)(create_noticia_dto_1.CreateNoticiaDto) {
}
exports.UpdateNoticiaDto = UpdateNoticiaDto;
//# sourceMappingURL=update-noticia.dto.js.map