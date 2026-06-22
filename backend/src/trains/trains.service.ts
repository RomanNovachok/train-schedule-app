import { Injectable } from '@nestjs/common';
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
    return this.prisma.train.update({
      where: { id },
      data,
    });
  }

  delete(id: number) {
    return this.prisma.train.delete({ where: { id } });
  }
}
