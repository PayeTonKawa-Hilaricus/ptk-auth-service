import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      create: jest
        .fn()
        .mockReturnValue({ userId: '1', email: 'test@test.com' }),
      findUnique: jest
        .fn()
        .mockResolvedValue({ userId: '1', email: 'test@test.com' }),
      // On ajoute les méthodes manquantes
      update: jest
        .fn()
        .mockResolvedValue({ userId: '1', email: 'updated@test.com' }),
      delete: jest.fn().mockResolvedValue({ userId: '1' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  it('create devrait appeler prisma.create', async () => {
    await service.create({ email: 'a@a.com', password: '123' });
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it('findOne devrait appeler prisma.findUnique', async () => {
    await service.findOne('1');
    expect(prisma.user.findUnique).toHaveBeenCalled();
  });

  it('update appelle prisma.update', async () => {
    await service.update('1', { email: 'new@test.com' });
    expect(prisma.user.update).toHaveBeenCalled();
  });

  it('remove appelle prisma.delete', async () => {
    await service.remove('1');
    expect(prisma.user.delete).toHaveBeenCalled();
  });
});
