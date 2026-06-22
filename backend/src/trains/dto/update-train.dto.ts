import { IsOptional, IsString, IsDateString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateTrainDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  trainNumber?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  direction?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  station?: string;

  @IsOptional()
  @IsDateString()
  departureTime?: string;

  @IsOptional()
  @IsDateString()
  arrivalTime?: string;
}
