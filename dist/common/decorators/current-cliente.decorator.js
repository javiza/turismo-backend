"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentCliente = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentCliente = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
//# sourceMappingURL=current-cliente.decorator.js.map