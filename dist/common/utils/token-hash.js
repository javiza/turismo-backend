"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashToken = hashToken;
exports.tokenMatches = tokenMatches;
const crypto_1 = require("crypto");
function hashToken(token) {
    return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
}
function tokenMatches(rawToken, hashedToken) {
    const a = Buffer.from(hashToken(rawToken), 'hex');
    const b = Buffer.from(hashedToken, 'hex');
    if (a.length !== b.length)
        return false;
    return (0, crypto_1.timingSafeEqual)(a, b);
}
//# sourceMappingURL=token-hash.js.map