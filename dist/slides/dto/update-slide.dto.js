"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSlideDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_slide_dto_1 = require("./create-slide.dto");
class UpdateSlideDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_slide_dto_1.CreateSlideDto, ['tipo', 'referenciaId'])) {
}
exports.UpdateSlideDto = UpdateSlideDto;
//# sourceMappingURL=update-slide.dto.js.map