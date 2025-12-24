import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// On mocke tout le module bcrypt dès le début
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest
      .fn()
      .mockResolvedValue({ userId: 'user-1', email: 'test@test.com' }),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('fake_jwt_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);

    // Configuration des mocks bcrypt pour ce test
    (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Le mot de passe sera toujours "bon"
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('devrait retourner un token JWT', async () => {
      // SCÉNARIO : L'utilisateur EXISTE
      mockUsersService.findByEmail.mockResolvedValue({
        userId: 'u1',
        email: 'a@a.com',
        password: 'hashed_password',
        role: 'USER',
      });

      const loginDto = {
        email: 'a@a.com',
        password: 'plain_password',
        userId: 'u1',
        role: 'USER',
      };

      const result = await service.login(loginDto as any);

      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toEqual('fake_jwt_token');
    });
  });

  describe('register', () => {
    it('devrait créer un utilisateur', async () => {
      // SCÉNARIO : L'utilisateur N'EXISTE PAS
      mockUsersService.findByEmail.mockResolvedValue(null);

      const dto = { email: 'new@test.com', password: '123' }; // Pas de 'name' ici pour éviter l'erreur DTO
      await service.register(dto as any);

      expect(usersService.create).toHaveBeenCalled();
    });
  });
});
