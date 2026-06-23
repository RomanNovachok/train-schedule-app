import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { UserRole, UserRoles } from '../common/user-roles';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: { email: string; passwordHash: string; role?: UserRole }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role ?? UserRoles.User,
      },
    });
  }
}
