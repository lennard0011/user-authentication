import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { AuthGuard } from './auth.guard';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: CredentialsDto): Promise<number> {
    const { email, password } = signUpDto;
    return await this.authService.signUp(email, password);
  }

  @Post('/signin')
  async signIn(@Body() signUpDto: CredentialsDto): Promise<SignInResponseDto> {
    const { email, password } = signUpDto;
    return await this.authService.signIn(email, password);
  }

  @Post('/refresh')
  async refresh(@Body() refreshDto: RefreshDto): Promise<SignInResponseDto> {
    return await this.authService.refresh(refreshDto.refreshToken);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: Request & { user: any }) {
    return req.user.id;
  }
}
