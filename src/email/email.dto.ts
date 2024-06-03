import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class EmailDto {
  @IsEmail()
  @IsNotEmpty()
  toEmail: string;

  @IsEmail()
  @IsNotEmpty()
  flightDate: string;

  @IsNumber()
  @IsNotEmpty()
  predictedDays: number;

  @IsNumber()
  @IsNotEmpty()
  departureHour: number;

  @IsNumber()
  @IsNotEmpty()
  departureMinute: number;
}
