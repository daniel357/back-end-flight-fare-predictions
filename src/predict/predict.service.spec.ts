import { Test, TestingModule } from '@nestjs/testing';
import { PredictService } from './predict.service';
import { ModelService } from '../model/model.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { FlightDetails } from '../common/dto/flightDetails';
import { AxiosResponse } from 'axios';
import { BadRequestException } from '@nestjs/common';

describe('PredictService', () => {
  let service: PredictService;
  let modelService: ModelService;
  let httpService: HttpService;

  const mockModelService = {
    predict: jest.fn().mockResolvedValue({ prediction: 100 }),
  };

  const mockHttpService = {
    get: jest.fn().mockReturnValue(
      of({
        data: [{ date: '2022-12-25' }],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as AxiosResponse),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PredictService,
        { provide: ModelService, useValue: mockModelService },
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<PredictService>(PredictService);
    modelService = module.get<ModelService>(ModelService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPrediction', () => {
    it('should return a prediction', async () => {
      const flightDetails: FlightDetails = {
        arrivalMinute: 30,
        departureMinute: 0,
        flightDate: '2022-12-25',
        departureHour: 10,
        arrivalHour: 12,
        searchDate: '2022-12-20',
      };

      const result = await service.getPrediction(flightDetails);

      expect(result).toEqual({ prediction: 100 });
      expect(modelService.predict).toHaveBeenCalledWith({
        daysBeforeFlight: 5,
        flightDayOfWeek: 0,
        travelDurationMinutes: 150,
        nearHoliday: true,
        flightMonth: 12,
        flightDay: 25,
        departureHour: 10,
        departureMinute: 0,
        arrivalHour: 12,
        arrivalMinute: 30,
      });
    });
  });

  describe('dateDifferenceInDays', () => {
    it('should return the correct number of days', () => {
      const result = service['dateDifferenceInDays'](
        '2022-12-25',
        '2022-12-20',
      );
      expect(result).toBe(5);
    });
  });

  describe('getDayOfWeek', () => {
    it('should return the correct day of the week', () => {
      const result = service['getDayOfWeek']('2022-12-25');
      expect(result).toBe(0); // Sunday
    });
  });

  describe('computeTotalTime', () => {
    it('should return the correct travel duration in minutes', () => {
      const result = service['computeTotalTime'](10, 0, 12, 30);
      expect(result).toBe(150);
    });

    it('should handle overnight flights correctly', () => {
      const result = service['computeTotalTime'](22, 0, 2, 30);
      expect(result).toBe(270); // 4 hours and 30 minutes
    });
  });

  describe('getHolidays', () => {
    it('should return a list of holidays', async () => {
      const result = await service.getHolidays();
      expect(result).toEqual([{ date: '2022-12-25' }]);
    });

    it('should throw an error if fetching holidays fails', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(throwError(() => new Error('error')));
      await expect(service.getHolidays()).rejects.toThrow(BadRequestException);
    });
  });

  describe('isDateNearHoliday', () => {
    it('should return true if the date is near a holiday', async () => {
      const result = await service.isDateNearHoliday('2022-12-23');
      expect(result).toBe(true);
    });

    it('should return false if the date is not near a holiday', async () => {
      const result = await service.isDateNearHoliday('2022-12-01');
      expect(result).toBe(false);
    });
  });
});
