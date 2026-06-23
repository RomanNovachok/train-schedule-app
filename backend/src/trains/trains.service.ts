import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';

@Injectable()
export class TrainsService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    return this.prisma.train.findMany({ orderBy: { departureTime: 'asc' } });
  }

  create(dto: CreateTrainDto) {
    const departureTime = new Date(dto.departureTime);
    const arrivalTime = new Date(dto.arrivalTime);

    this.ensureArrivalNotBeforeDeparture(departureTime, arrivalTime);

    const data = {
      ...dto,
      departureTime,
      arrivalTime,
    };

    return this.prisma.train.create({ data });
  }

  update(id: number, dto: UpdateTrainDto) {
    const departureTime = dto.departureTime ? new Date(dto.departureTime) : undefined;
    const arrivalTime = dto.arrivalTime ? new Date(dto.arrivalTime) : undefined;

    if (departureTime && arrivalTime) {
      this.ensureArrivalNotBeforeDeparture(departureTime, arrivalTime);
    }

    const data = {
      ...dto,
      departureTime,
      arrivalTime,
    };

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
        }

        throw error;
      });
  }

  delete(id: number) {
    return this.prisma.train.delete({ where: { id } });
  }

  private ensureArrivalNotBeforeDeparture(departureTime: Date, arrivalTime: Date) {
    if (arrivalTime < departureTime) {
      throw new BadRequestException('Arrival time must be same or after departure time');
    }
  }
}
