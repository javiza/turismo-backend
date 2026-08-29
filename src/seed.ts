import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AppModule } from './app.module';
import { User } from './users/entities/user.entity'; // <-- ajusta el path si difiere
import { Cliente } from './clientes/entities/cliente.entity'; // <-- ajusta el path si difiere

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  const clienteRepository = app.get<Repository<Cliente>>(
    getRepositoryToken(Cliente),
  );

  const rounds = Number(process.env.BCRYPT_ROUNDS) || 10;

  // --- Admin (tabla "usuarios") ---
  const adminData = {
    email: process.env.SEED_ADMIN_EMAIL ?? 'admin@turismo.cl',
    password: process.env.SEED_ADMIN_PASSWORD ?? 'CambiaEstaClave123!',
    nombre: process.env.SEED_ADMIN_NOMBRE ?? 'Admin',
    rol: 'ADMIN',
    activo: true,
  };

  const existingAdmin = await userRepository.findOne({
    where: { email: adminData.email },
  });

  if (existingAdmin) {
    console.log(`Ya existe admin: ${adminData.email}, se omite.`);
  } else {
    const hashedPassword = await bcrypt.hash(adminData.password, rounds);
    const admin = userRepository.create({
      ...adminData,
      password: hashedPassword,
    });
    await userRepository.save(admin);
    console.log(`Admin creado: ${adminData.email}`);
  }

  // --- Cliente demo (tabla "clientes") ---
  // Ajusta o borra este bloque si no necesitas un cliente de prueba;
  // los clientes reales normalmente se registran solos desde la app.
  const clienteData = {
    email: process.env.SEED_CLIENTE_EMAIL ?? 'cliente@turismo.cl',
    password: process.env.SEED_CLIENTE_PASSWORD ?? 'ClaveCliente123!',
    nombre: process.env.SEED_CLIENTE_NOMBRE ?? 'Cliente Demo',
    activo: true,
    telefonosAdicionales: [],
    correosAdicionales: [],
  };

  const existingCliente = await clienteRepository.findOne({
    where: { email: clienteData.email },
  });

  if (existingCliente) {
    console.log(`Ya existe cliente: ${clienteData.email}, se omite.`);
  } else {
    const hashedPassword = await bcrypt.hash(clienteData.password, rounds);
    const cliente = clienteRepository.create({
      ...clienteData,
      password: hashedPassword,
    });
    await clienteRepository.save(cliente);
    console.log(`Cliente creado: ${clienteData.email}`);
  }

  await app.close();
  console.log('Seed finalizado.');
}

seed().catch((err) => {
  console.error('Error al ejecutar el seed:', err);
  process.exit(1);
});
