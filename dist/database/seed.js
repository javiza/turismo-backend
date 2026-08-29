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
async function seed() {
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
    const existingCount = await userRepository.count();
    if (existingCount > 0) {
        console.log(`Ya existen ${existingCount} usuario(s) en la base de datos. ` +
            'No se crea ningún SUPER_ADMIN automáticamente (el seed solo actúa sobre una tabla vacía).');
        await dataSource.destroy();
        return;
    }
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;
    const nombre = process.env.SEED_ADMIN_NOMBRE ?? 'Administrador';
    if (!email || !password) {
        console.error('Faltan SEED_ADMIN_EMAIL y/o SEED_ADMIN_PASSWORD en el .env. Defínelos antes de correr "npm run seed".');
        await dataSource.destroy();
        process.exit(1);
    }
    if (password.length < 8) {
        console.error('SEED_ADMIN_PASSWORD debe tener al menos 8 caracteres.');
        await dataSource.destroy();
        process.exit(1);
    }
    const hashedPassword = await bcrypt.hash(password, (0, bcrypt_rounds_1.getBcryptRounds)());
    const admin = userRepository.create({
        nombre,
        email,
        password: hashedPassword,
        rol: user_entity_1.UserRole.SUPER_ADMIN,
        activo: true,
    });
    await userRepository.save(admin);
    console.log(`SUPER_ADMIN creado correctamente: ${email}`);
    console.log('Por seguridad, elimina o cambia SEED_ADMIN_PASSWORD en tu .env ahora que el usuario ya existe.');
    await dataSource.destroy();
}
seed().catch((err) => {
    console.error('Error al ejecutar el seed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map