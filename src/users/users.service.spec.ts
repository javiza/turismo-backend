import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { createMockRepository, MockRepository } from '../test/typeorm-mock.helper';

describe('UsersService', () => {
  let service: UsersService;
  let repo: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: createMockRepository<User>() },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('lanza ConflictException si el email ya existe', async () => {
      repo.findOne.mockResolvedValue({ id: 1, email: 'ya@existe.com' });

      await expect(
        service.create({ email: 'ya@existe.com', password: '123456' } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('hashea la contraseña antes de guardar', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.save.mockImplementation((u) => Promise.resolve({ id: 1, ...u }));

      const user = await service.create({
        email: 'nuevo@test.com',
        password: 'password123',
        nombre: 'Nuevo',
      } as any);

      expect(user.password).not.toBe('password123');
      expect(await bcrypt.compare('password123', user.password)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('lanza NotFoundException si no existe', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('devuelve el usuario si existe', async () => {
      const user = { id: 1, email: 'a@a.com' };
      repo.findOne.mockResolvedValue(user);
      await expect(service.findOne(1)).resolves.toEqual(user);
    });
  });

  describe('deactivate', () => {
    it('marca activo=false y guarda', async () => {
      repo.findOne.mockResolvedValue({ id: 1, activo: true });
      repo.save.mockImplementation((u) => Promise.resolve(u));

      const result = await service.deactivate(1);
      expect(result.activo).toBe(false);
    });
  });

  describe('clearRefreshToken', () => {
    it('limpia el hashedRefreshToken en null', async () => {
      await service.clearRefreshToken(1);
      expect(repo.update).toHaveBeenCalledWith(1, { hashedRefreshToken: null });
    });
  });
});
