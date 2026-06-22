import { IsNotEmpty, IsString, IsDateString, MaxLength } from 'class-validator';

export class CreateTrainDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  trainNumber!: string;

  @IsNotEmpty()
  @IsString()
  direction!: string;

  @IsNotEmpty()
  @IsString()
  station!: string;

  @IsNotEmpty()
  @IsDateString()
  departureTime!: string;

  @IsNotEmpty()
  @IsDateString()
  arrivalTime!: string;
}
