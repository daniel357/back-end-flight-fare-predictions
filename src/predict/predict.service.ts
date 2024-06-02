import { BadRequestException, Injectable } from '@nestjs/common';
import { PredictionResponse } from '../common/interfaces/prediction.interface';
import { ModelService } from '../model/model.service';
import { FlightDetails } from '../common/dto/flightDetails';
import { lastValueFrom } from 'rxjs';
import { PUBLIC_HOLIDAYS_API } from '../common/constants';
import { HttpService } from '@nestjs/axios';
import { HolidayDto } from '../common/dto/holidayDto';

@Injectable()
export class PredictService {
  constructor(
    private readonly modelService: ModelService,
    private readonly httpService: HttpService,
  ) {}

  async getPrediction(
    flightDetails: FlightDetails,
  ): Promise<PredictionResponse> {
    const {
      arrivalMinute,
      departureMinute,
      flightDate,
      departureHour,
      arrivalHour,
      searchDate,
    } = flightDetails;
    const daysBeforeFlight = this.dateDifferenceInDays(flightDate, searchDate);
    const flightDayOfWeek = this.getDayOfWeek(flightDate);
    const travelDurationMinutes = this.computeTotalTime(
      departureHour,
      departureMinute,
      arrivalHour,
      arrivalMinute,
    );
    const nearHoliday = await this.isDateNearHoliday(flightDate);
    const [flightMonth, flightDay] = this.splitDate(flightDate);
    console.log(flightDetails);
    return this.modelService.predict({
      daysBeforeFlight,
      flightDayOfWeek,
      travelDurationMinutes,
      nearHoliday,
      flightMonth,
      flightDay,
      departureHour,
      departureMinute,
      arrivalHour,
      arrivalMinute,
    });
  }

  private splitDate(dateString: string): [number, number] {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return [month, day];
  }

  private dateDifferenceInDays(flightDate: string, searchDate: string): number {
    const diffTime =
      new Date(flightDate).getTime() - new Date(searchDate).getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private getDayOfWeek(dateString: string): number {
    const date = new Date(dateString);
    return date.getDay();
  }

  private computeTotalTime(
    departureHour: number,
    departureMinute: number,
    arrivalHour: number,
    arrivalMinute: number,
  ): number {
    const departureTotalMinutes = departureHour * 60 + departureMinute;
    const arrivalTotalMinutes = arrivalHour * 60 + arrivalMinute;

    if (arrivalTotalMinutes < departureTotalMinutes) {
      return arrivalTotalMinutes + 24 * 60 - departureTotalMinutes;
    } else {
      return arrivalTotalMinutes - departureTotalMinutes;
    }
  }

  async getHolidays(): Promise<HolidayDto[]> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(PUBLIC_HOLIDAYS_API),
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException('Failed to fetch holidays');
    }
  }

  async isDateNearHoliday(dateString: string): Promise<boolean> {
    const holidays = await this.getHolidays();
    return holidays.some((holiday) => {
      const diffDays = this.dateDifferenceInDays(dateString, holiday.date);
      return diffDays <= 5;
    });
  }
}
