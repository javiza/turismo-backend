/**
 * Seed script: crea el primer usuario SUPER_ADMIN.
 *
 * Resuelve el problema de "huevo y gallina": POST /users ahora exige
 * un token de un SUPER_ADMIN existente, así que la única forma de crear
 * el primero es insertándolo directamente en la base de datos.
 *
 * Uso:
 *   1. Define en tu .env:
 *        SEED_ADMIN_EMAIL=admin@tuagencia.com
 *        SEED_ADMIN_PASSWORD=12345678
 *        SEED_ADMIN_NOMBRE=Nombre Apellido   (opcional)
 *   2. Corre:  npm run seed
 *   3. Inicia sesión con esas credenciales en POST /api/v1/auth/login.
 *   4. Elimina SEED_ADMIN_PASSWORD del .env (o cámbiala) una vez creado.
 *
 * El script NO crea un segundo SUPER_ADMIN si ya existe al menos un
 * usuario en la tabla — así evitamos ejecuciones accidentales repetidas.
 */

import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { getBcryptRounds } from '../common/utils/bcrypt-rounds';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    synchronize: false,
  });

  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  const existingCount = await userRepository.count();

  if (existingCount > 0) {
    console.log(
      `Ya existen ${existingCount} usuario(s) en la base de datos. ` +
        'No se crea ningún SUPER_ADMIN automáticamente (el seed solo actúa sobre una tabla vacía).',
    );
    await dataSource.destroy();
    return;
  }

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const nombre = process.env.SEED_ADMIN_NOMBRE ?? 'Administrador';

  if (!email || !password) {
    console.error(
      'Faltan SEED_ADMIN_EMAIL y/o SEED_ADMIN_PASSWORD en el .env. Defínelos antes de correr "npm run seed".',
    );
    await dataSource.destroy();
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('SEED_ADMIN_PASSWORD debe tener al menos 8 caracteres.');
    await dataSource.destroy();
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, getBcryptRounds());

  const admin = userRepository.create({
    nombre,
    email,
    password: hashedPassword,
    rol: UserRole.SUPER_ADMIN,
    activo: true,
  });

  await userRepository.save(admin);

  console.log(`SUPER_ADMIN creado correctamente: ${email}`);
  console.log(
    'Por seguridad, elimina o cambia SEED_ADMIN_PASSWORD en tu .env ahora que el usuario ya existe.',
  );

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Error al ejecutar el seed:', err);
  process.exit(1);
});
