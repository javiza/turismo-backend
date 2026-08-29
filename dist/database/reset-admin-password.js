"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../users/entities/user.entity");
const bcrypt_rounds_1 = require("../common/utils/bcrypt-rounds");
async function resetPassword() {
    const email = process.env.RESET_ADMIN_EMAIL;
    const password = process.env.RESET_ADMIN_PASSWORD;
    if (!email || !password) {
        console.error('Faltan RESET_ADMIN_EMAIL y/o RESET_ADMIN_PASSWORD. Ejemplo:\n' +
            '  RESET_ADMIN_EMAIL=admin@turismo.com RESET_ADMIN_PASSWORD=12345678 npm run reset-admin-password');
        process.exit(1);
    }
    if (password.length < 8) {
        console.error('RESET_ADMIN_PASSWORD debe tener al menos 8 caracteres.');
        process.exit(1);
    }
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [user_entity_1.User],
        synchronize: false,
    });
    await dataSource.initialize();
    const userRepository = dataSource.getRepository(user_entity_1.User);
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
        const todos = await userRepository.find({ select: ['id', 'email', 'rol', 'activo'] });
        console.error(`No existe ningún usuario con email "${email}".`);
        console.log('Usuarios existentes en la base:');
        console.table(todos);
        await dataSource.destroy();
        process.exit(1);
    }
    user.password = await bcrypt.hash(password, (0, bcrypt_rounds_1.getBcryptRounds)());
    user.activo = true;
    await userRepository.save(user);
    console.log(`Contraseña actualizada para ${email}. Ya podés hacer login con esa contraseña.`);
    await dataSource.destroy();
}
resetPassword().catch((err) => {
    console.error('Error al resetear la contraseña:', err);
    process.exit(1);
});
//# sourceMappingURL=reset-admin-password.js.map