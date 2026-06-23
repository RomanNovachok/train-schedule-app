import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'new-user@mail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'user123',
    minLength: 6,
    description: 'At least 6 characters long, with at least one letter and one number.',
  })
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
