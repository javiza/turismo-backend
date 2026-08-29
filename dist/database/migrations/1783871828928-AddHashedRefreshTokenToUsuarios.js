"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddHashedRefreshTokenToUsuarios1783871828928 = void 0;
class AddHashedRefreshTokenToUsuarios1783871828928 {
    name = 'AddHashedRefreshTokenToUsuarios1783871828928';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "hashedRefreshToken" character varying`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN IF EXISTS "hashedRefreshToken"`);
    }
}
exports.AddHashedRefreshTokenToUsuarios1783871828928 = AddHashedRefreshTokenToUsuarios1783871828928;
//# sourceMappingURL=1783871828928-AddHashedRefreshTokenToUsuarios.js.map