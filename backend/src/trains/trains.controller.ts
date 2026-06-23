import { Body, Controller, Delete, Get, Param, Patch, Post, Logger } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TrainsService } from './trains.service';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { UserRoles } from '../common/user-roles';
import { RoleProtected } from '../common/role-protected.decorator';

@ApiTags('trains')
@Controller('trains')
export class TrainsController {
  private readonly logger = new Logger(TrainsController.name);

  constructor(private trainsService: TrainsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get train schedule',
    description: 'Public endpoint. Returns the full train schedule sorted by departure time.',
  })
  getAll() {
    return this.trainsService.getAll();
  }

  @RoleProtected(UserRoles.User, UserRoles.Admin)
  @ApiOperation({
    summary: 'Create a train',
    description: 'Requires JWT authentication. Allowed roles: USER, ADMIN.',
  })
  @ApiOkResponse({ description: 'Train created successfully' })
  @Post()
  create(@Body() dto: CreateTrainDto) {
    this.logger.debug(`Create train body: ${JSON.stringify(dto)}`);
    return this.trainsService.create(dto);
  }

  @RoleProtected(UserRoles.User, UserRoles.Admin)
  @ApiOperation({
    summary: 'Update a train',
    description: 'Requires JWT authentication. Allowed roles: USER, ADMIN.',
  })
  @ApiParam({ name: 'id', example: 13, description: 'Train identifier' })
  @ApiOkResponse({ description: 'Train updated successfully' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTrainDto) {
    this.logger.debug(`Update train body: ${JSON.stringify(dto)}`);
    return this.trainsService.update(Number(id), dto);
  }

  @RoleProtected(UserRoles.Admin)
  @ApiOperation({
    summary: 'Delete a train',
    description: 'Requires JWT authentication. Allowed role: ADMIN only.',
  })
  @ApiParam({ name: 'id', example: 13, description: 'Train identifier' })
  @ApiOkResponse({ description: 'Train deleted successfully' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.trainsService.delete(Number(id));
  }
}
