import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should succesfully sign up', () => {
    service.signUp('email@gmail.com', 'password');
  });

  it('should fail sign in if user does not exists', () => {
    service.signIn('nonexistingEmail@gmail.com', 'password');
  });
});
