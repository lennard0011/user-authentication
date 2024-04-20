import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string) {
    const existingUser = await this.usersRepository.findOneBy({ email });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const salt = crypto.randomBytes(128).toString('base64');
    const hashedPassword = hashPassword(salt, password);
    const user = { email, password: hashedPassword, salt };
    const createdUser = await this.usersRepository.save(user);
    return createdUser.id;
  }

  async signIn(email: string, password: string): Promise<SignInResponseDto> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('Please check your login credentials');
    }
    const hashedPassword = hashPassword(user.salt, password);
    if (hashedPassword !== user.password) {
      throw new UnauthorizedException('Please check your login credentials');
    }

    const payload = { id: user.id, email: user.email, role: 'user' };
    return await this.signAsync(payload);
  }

  async refresh(refreshToken: string): Promise<SignInResponseDto> {
    const { id } = await this.jwtService.verifyAsync(refreshToken, {
      secret: jwtConstants.secret,
    });

    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new UnauthorizedException('Please check your login credentials');
    }

    const payload = { id: user.id, email: user.email, role: 'user' };
    return await this.signAsync(payload);
  }

  private async signAsync(user: { id: number; email: string; role: string }) {
    const payload = { id: user.id, email: user.email, role: 'user' };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '10s',
      }),
      refresh_token: await this.jwtService.signAsync(
        { id: user.id },
        {
          expiresIn: '7d',
        },
      ),
    };
  }
}

function hashPassword(salt: string, myString: string) {
  return crypto.pbkdf2Sync(myString, salt, 10, 64, 'sha512').toString('base64');
}
