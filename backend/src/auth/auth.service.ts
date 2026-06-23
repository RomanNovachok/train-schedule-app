import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new UnauthorizedException('Email already in use');
    }

    if (!this.isValidPassword(password)) {
      throw new BadRequestException(
        'Password must be at least 6 characters long and contain at least one letter and one number.',
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ email, passwordHash });
    return this.getAuthResponse(user.id, user.email, user.role);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return null;
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.getAuthResponse(user.id, user.email, user.role);
  }

  private isValidPassword(password: string) {
    return /[A-Za-z]/.test(password) && /\d/.test(password) && password.length >= 6;
  }

  getAuthResponse(id: number, email: string, role: string) {
    const payload = { sub: id, email, role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id, email, role },
    };
  }
}
