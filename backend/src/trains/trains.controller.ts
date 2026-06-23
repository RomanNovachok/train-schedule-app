import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, BadRequestException, Logger } from '@nestjs/common';
import { TrainsService } from './trains.service';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UserRoles } from '../common/user-roles';

@Controller('trains')
export class TrainsController {
  private readonly logger = new Logger(TrainsController.name);

  constructor(private trainsService: TrainsService) {}

  @Get()
  getAll() {
    return this.trainsService.getAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.User, UserRoles.Admin)
  @Post()
  create(@Body() dto: CreateTrainDto) {
    this.logger.debug(`Create train body: ${JSON.stringify(dto)}`);
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
  @Roles(UserRoles.User, UserRoles.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTrainDto) {
    this.logger.debug(`Update train body: ${JSON.stringify(dto)}`);
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
  @Roles(UserRoles.Admin)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.trainsService.delete(Number(id));
  }
}
