/**
 * Resetea la contraseña de un usuario existente por email. Útil cuando no
 * se sabe con certeza qué credenciales quedaron de una corrida anterior
 * de "npm run seed" (el seed es idempotente: si la tabla ya tenía algún
 * usuario, no crea ni pisa nada).
 *
 * Usa el mismo paquete "bcrypt" que AuthService.login para comparar, así
 * que el hash generado acá es 100% compatible (no hay riesgo de mezclar
 * formatos de hash distintos).
 *
 * Uso:
 *   RESET_ADMIN_EMAIL=admin@turismo.com RESET_ADMIN_PASSWORD=12345678 npm run reset-admin-password
 *
 * Si el email no existe, el script lo lista pero no crea uno nuevo (para
 * eso está "npm run seed", que solo funciona con la tabla vacía).
 */
import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { getBcryptRounds } from '../common/utils/bcrypt-rounds';

async function resetPassword() {
  const email = process.env.RESET_ADMIN_EMAIL;
  const password = process.env.RESET_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      'Faltan RESET_ADMIN_EMAIL y/o RESET_ADMIN_PASSWORD. Ejemplo:\n' +
        '  RESET_ADMIN_EMAIL=admin@turismo.com RESET_ADMIN_PASSWORD=12345678 npm run reset-admin-password',
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('RESET_ADMIN_PASSWORD debe tener al menos 8 caracteres.');
    process.exit(1);
  }

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

  const user = await userRepository.findOne({ where: { email } });

  if (!user) {
    const todos = await userRepository.find({ select: ['id', 'email', 'rol', 'activo'] });
    console.error(`No existe ningún usuario con email "${email}".`);
    console.log('Usuarios existentes en la base:');
    console.table(todos);
    await dataSource.destroy();
    process.exit(1);
  }

  user.password = await bcrypt.hash(password, getBcryptRounds());
  user.activo = true; // por si además estaba desactivado, lo reactiva.
  await userRepository.save(user);

  console.log(`Contraseña actualizada para ${email}. Ya podés hacer login con esa contraseña.`);
  await dataSource.destroy();
}

resetPassword().catch((err) => {
  console.error('Error al resetear la contraseña:', err);
  process.exit(1);
});