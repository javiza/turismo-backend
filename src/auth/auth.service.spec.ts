import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const usuarioBase = {
    id: 1,
    email: 'admin@test.com',
    nombre: 'Admin',
    rol: 'admin',
    activo: true,
    password: '',
    hashedRefreshToken: null as string | null,
  };

  beforeEach(async () => {
    usuarioBase.password = await bcrypt.hash('secreta123', 4);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findOne: jest.fn(),
            updateRefreshToken: jest.fn(),
            clearRefreshToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token-firmado'),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => `valor-${key}`),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('rechaza si el email no existe', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'no@existe.com', password: 'x' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rechaza si la contraseña no coincide', async () => {
      usersService.findByEmail.mockResolvedValue(usuarioBase as any);

      await expect(
        service.login({ email: usuarioBase.email, password: 'incorrecta' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rechaza usuarios desactivados aunque la contraseña sea correcta', async () => {
      usersService.findByEmail.mockResolvedValue({
        ...usuarioBase,
        activo: false,
      } as any);

      await expect(
        service.login({ email: usuarioBase.email, password: 'secreta123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('devuelve tokens y guarda el refresh token si todo es correcto', async () => {
      usersService.findByEmail.mockResolvedValue(usuarioBase as any);

      const tokens = await service.login({
        email: usuarioBase.email,
        password: 'secreta123',
      });

      expect(tokens).toEqual({
        access_token: 'token-firmado',
        refresh_token: 'token-firmado',
      });
      expect(usersService.updateRefreshToken).toHaveBeenCalledWith(
        usuarioBase.id,
        'token-firmado',
      );
    });
  });

  describe('refresh', () => {
    it('rechaza un refresh token con firma/expiración inválida', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('jwt expired'));

      await expect(
        service.refresh({ refreshToken: 'invalido' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rechaza si el hash guardado no coincide (token ya rotado/robado)', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: 1, email: usuarioBase.email });
      usersService.findByEmail.mockResolvedValue({
        ...usuarioBase,
        hashedRefreshToken: 'otro-hash-distinto',
      } as any);

      await expect(
        service.refresh({ refreshToken: 'un-token-viejo' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('limpia el refresh token del usuario', async () => {
      await service.logout(1);
      expect(usersService.clearRefreshToken).toHaveBeenCalledWith(1);
    });
  });
});
