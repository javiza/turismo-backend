"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const getDatabaseConfig = (config) => ({
    type: 'postgres',
    host: config.getOrThrow('DB_HOST'),
    port: Number(config.get('DB_PORT')),
    username: config.getOrThrow('DB_USER'),
    password: config.getOrThrow('DB_PASSWORD'),
    database: config.getOrThrow('DB_NAME'),
    autoLoadEntities: true,
    synchronize: false,
    logging: false,
    ssl: config.get('NODE_ENV') === 'production'
        ? { rejectUnauthorized: false }
        : false,
});
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map