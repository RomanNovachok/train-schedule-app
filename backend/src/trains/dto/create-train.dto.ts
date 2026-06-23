import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, MaxLength } from 'class-validator';

export class CreateTrainDto {
  @ApiProperty({ example: '101A', maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  trainNumber!: string;

  @ApiProperty({ example: 'Southbound' })
  @IsNotEmpty()
  @IsString()
  direction!: string;

  @ApiProperty({ example: 'East Station' })
  @IsNotEmpty()
  @IsString()
  station!: string;

  @ApiProperty({ example: '2026-06-23T16:05:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  departureTime!: string;

  @ApiProperty({ example: '2026-06-23T18:09:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  arrivalTime!: string;
}
