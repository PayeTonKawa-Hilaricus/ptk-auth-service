import { JwtStrategy } from './jwt.strategy';
import { Test, TestingModule } from '@nestjs/testing';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    // On doit mocker le process.env ou la config si nécessaire,
    // mais souvent pour un test unitaire simple, l'instanciation suffit si le super() ne plante pas.
    // Si ça plante, il faut mocker ConfigService.

    // Hack pour éviter l'erreur de secret manquant lors du test
    process.env.JWT_SECRET = 'test_secret';

    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('devrait être défini', () => {
    expect(strategy).toBeDefined();
  });

  it('validate devrait renvoyer le payload enrichi', async () => {
    const payload = { sub: 'u1', email: 'test@test.com', role: 'USER' };
    const result = await strategy.validate(payload);
    expect(result).toEqual({
      userId: 'u1',
      email: 'test@test.com',
      role: 'USER',
    });
  });
});
