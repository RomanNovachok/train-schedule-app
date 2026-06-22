import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TrainsModule } from './trains/trains.module';
import { PrismaModule } from './common/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, TrainsModule],
})
export class AppModule {}
