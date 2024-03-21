import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

const users: { id: string; email: string; password: string }[] = [];

@Injectable()
export class AuthService {
  constructor() {}

  signUp(email: string, password: string) {
    const id = Math.random().toString();
    const hashedPassword = hashString(`${id}${password}`);
    const user = { id, email, password: hashedPassword };
    users.push(user);
    console.log(user);
    return user.id;
  }

  signIn(email: string, password: string) {
    const user = users.find((user) => user.email === email);
    if (!user) {
      throw new UnauthorizedException('Please check your login credentials');
    }
    const id = user.id;
    const hashedPassword = hashString(`${id}${password}`);
    if (hashedPassword !== user.password) {
      throw new UnauthorizedException('Please check your login credentials');
    }
    return user.id;
  }
}

function hashString(myString: string) {
  return crypto.createHash('sha256').update(myString).digest('hex');
}
