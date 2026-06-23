import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateTrainDto {
  @ApiPropertyOptional({ example: '101A', maxLength: 50 })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  trainNumber?: string;

  @ApiPropertyOptional({ example: 'Southbound' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  direction?: string;

  @ApiPropertyOptional({ example: 'East Station' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  station?: string;

  @ApiPropertyOptional({ example: '2026-06-23T16:05:00.000Z' })
  @IsOptional()
  @IsDateString()
  departureTime?: string;

  @ApiPropertyOptional({ example: '2026-06-23T18:09:00.000Z' })
  @IsOptional()
  @IsDateString()
  arrivalTime?: string;
}
