"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBcryptRounds = getBcryptRounds;
function getBcryptRounds() {
    const raw = process.env.BCRYPT_ROUNDS;
    const parsed = raw ? parseInt(raw, 10) : NaN;
    if (Number.isFinite(parsed) && parsed > 0)
        return parsed;
    return 10;
}
//# sourceMappingURL=bcrypt-rounds.js.map