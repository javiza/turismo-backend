import 'dotenv/config';

import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',

  host: process.env.DB_HOST,

  port: Number(process.env.DB_PORT),

  username: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,
   ssl:
    process.env.DB_SSL === 'true'
      ? { rejectUnauthorized: false }
      : false,

  entities: ['dist/**/*.entity.js'],

  migrations: ['dist/database/migrations/*.js'],
});