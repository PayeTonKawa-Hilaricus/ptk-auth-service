import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn().mockResolvedValue({ userId: '1' }),
    findOne: jest.fn().mockResolvedValue({ userId: '1' }),
    // On ajoute les méthodes manquantes
    update: jest.fn().mockResolvedValue({ userId: '1' }),
    remove: jest.fn().mockResolvedValue({ userId: '1' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  it('create appelle le service', async () => {
    const dto = { email: 'a@a.com', password: '123' };
    await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('findOne appelle le service', async () => {
    await controller.findOne('1');
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('update appelle le service', async () => {
    await controller.update('1', {});
    expect(service.update).toHaveBeenCalled();
  });

  it('remove appelle le service', async () => {
    await controller.remove('1');
    expect(service.remove).toHaveBeenCalled();
  });
});
