import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ access_token: 'token' }),
    register: jest.fn().mockResolvedValue({ id: '1', email: 'test@test.com' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  it('login devrait retourner un token', async () => {
    // On utilise le vrai type LoginDto
    const loginDto: LoginDto = { email: 'a@a.com', password: '123' };

    // Plus besoin de "as any" !
    const result = await controller.login(loginDto);

    expect(result).toEqual({ access_token: 'token' });
    expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
  });

  it('register devrait créer un user', async () => {
    // On utilise le vrai type CreateUserDto
    const dto: CreateUserDto = {
      email: 'test@test.com',
      password: '123',
      // J'ai retiré 'name' car il n'est pas dans ton DTO
    };

    // Plus besoin de "as any"
    await controller.register(dto);

    expect(mockAuthService.register).toHaveBeenCalledWith(dto);
  });
});
