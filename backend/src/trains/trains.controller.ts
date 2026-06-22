import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, BadRequestException } from '@nestjs/common';
import { TrainsService } from './trains.service';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@Controller('trains')
export class TrainsController {
  constructor(private trainsService: TrainsService) {}

  @Get()
  getAll() {
    return this.trainsService.getAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @Post()
  create(@Body() dto: CreateTrainDto) {
    console.log('Backend create train body:', dto);
    if (new Date(dto.arrivalTime) < new Date(dto.departureTime)) {
      throw new BadRequestException('Arrival time must be same or after departure time');
    }
    return this.trainsService.create({
      ...dto,
      departureTime: new Date(dto.departureTime),
      arrivalTime: new Date(dto.arrivalTime),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTrainDto) {
    console.log('Backend update train body:', dto);
    if (dto.departureTime && dto.arrivalTime) {
      if (new Date(dto.arrivalTime) < new Date(dto.departureTime)) {
        throw new BadRequestException('Arrival time must be same or after departure time');
      }
    }
    return this.trainsService.update(Number(id), {
      ...dto,
      departureTime: dto.departureTime ? new Date(dto.departureTime) : undefined,
      arrivalTime: dto.arrivalTime ? new Date(dto.arrivalTime) : undefined,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.trainsService.delete(Number(id));
  }
}
