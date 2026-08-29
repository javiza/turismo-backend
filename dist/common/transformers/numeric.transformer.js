"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numericTransformer = void 0;
exports.numericTransformer = {
    to: (value) => value,
    from: (value) => value === null || value === undefined ? value : parseFloat(value),
};
//# sourceMappingURL=numeric.transformer.js.map