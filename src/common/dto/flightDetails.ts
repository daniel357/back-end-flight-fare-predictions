import { IsBoolean, IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class FlightDetails {
  @IsNotEmpty()
  @IsDateString()
  searchDate: string;

  @IsNotEmpty()
  @IsDateString()
  flightDate: string;

  @IsNumber()
  @IsNotEmpty()
  departureHour: number;

  @IsNumber()
  @IsNotEmpty()
  departureMinute: number;

  @IsNumber()
  @IsNotEmpty()
  arrivalHour: number;

  @IsNumber()
  @IsNotEmpty()
  arrivalMinute: number;
}

export class ModelFeatures {
  @IsNumber()
  @IsNotEmpty()
  flightDay: number;

  @IsNumber()
  @IsNotEmpty()
  flightMonth: number;

  @IsNumber()
  @IsNotEmpty()
  departureHour: number;

  @IsNumber()
  @IsNotEmpty()
  departureMinute: number;

  @IsNumber()
  @IsNotEmpty()
  arrivalHour: number;

  @IsNumber()
  @IsNotEmpty()
  arrivalMinute: number;

  @IsNumber()
  @IsNotEmpty()
  daysBeforeFlight: number;

  @IsNumber()
  @IsNotEmpty()
  flightDayOfWeek: number;

  @IsNumber()
  @IsNotEmpty()
  travelDurationMinutes: number;

  @IsBoolean()
  @IsNotEmpty()
  nearHoliday: boolean;
}
