import { Module } from '@nestjs/common';
import { TrainsService } from './trains.service';
import { TrainsController } from './trains.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  providers: [TrainsService],
  controllers: [TrainsController],
})
export class TrainsModule {}
