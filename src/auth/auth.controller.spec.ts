import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

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
    // On envoie un objet qui ressemble à LoginDto
    const loginDto = { email: 'a@a.com', password: '123' };

    const result = await controller.login(loginDto as any);

    expect(result).toEqual({ access_token: 'token' });
    // On vérifie que le service a été appelé avec le bon objet
    expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
  });

  it('register devrait créer un user', async () => {
    const dto = { email: 'test@test.com', password: '123', name: 'Bob' };

    // Maintenant cette méthode existe dans le contrôleur !
    await controller.register(dto as any);

    expect(mockAuthService.register).toHaveBeenCalledWith(dto);
  });
});
