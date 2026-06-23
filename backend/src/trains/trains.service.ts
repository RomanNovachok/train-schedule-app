import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class TrainsService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    return this.prisma.train.findMany({ orderBy: { departureTime: 'asc' } });
  }

  create(data: {
    trainNumber: string;
    direction: string;
    station: string;
    departureTime: Date;
    arrivalTime: Date;
  }) {
    return this.prisma.train.create({ data });
  }

  update(id: number, data: Partial<{ trainNumber: string; direction: string; station: string; departureTime: Date; arrivalTime: Date }>) {
    return this.prisma.train
      .update({
        where: { id },
        data,
      })
      .catch((error: unknown) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new NotFoundException(`Train with id ${id} not found`);
          }

          if (error.code === 'P2002') {
            throw new ConflictException('Train number already exists');
          }
        }

        throw error;
      });
  }

  delete(id: number) {
    return this.prisma.train.delete({ where: { id } });
  }
}
