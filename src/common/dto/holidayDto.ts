import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class HolidayDto {
  @IsDateString()
  @IsNotEmpty()
  readonly date: string;

  @IsString()
  @IsNotEmpty()
  readonly localName: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly countryCode: string;

  @IsBoolean()
  readonly fixed: boolean;

  @IsBoolean()
  readonly global: boolean;

  @IsString({ each: true })
  @IsOptional()
  readonly counties?: string[];

  @ValidateIf((o) => o.launchYear !== null)
  @IsString()
  @IsOptional()
  readonly launchYear?: string;

  @IsString({ each: true })
  @IsNotEmpty()
  readonly types: string[];
}
