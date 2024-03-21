import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: CredentialsDto): string {
    const { email, password } = signUpDto;
    return this.authService.signUp(email, password);
  }

  @Post('/signin')
  signIn(@Body() signUpDto: CredentialsDto): string {
    const { email, password } = signUpDto;
    return this.authService.signIn(email, password);
  }
}
