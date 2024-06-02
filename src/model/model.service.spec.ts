import { Test, TestingModule } from '@nestjs/testing';
import { ModelService } from './model.service';
import axios, { AxiosResponse } from 'axios';
import { API_URLS } from '../common/constants';
import { PredictionResponse } from '../common/interfaces/prediction.interface';
import { ModelFeatures } from '../common/dto/flightDetails';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ModelService', () => {
  let service: ModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelService],
    }).compile();

    service = module.get<ModelService>(ModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('predict', () => {
    it('should return prediction response', async () => {
      const modelFeatures: ModelFeatures = {
        flightDay: 25,
        flightMonth: 12,
        departureHour: 10,
        departureMinute: 0,
        arrivalHour: 12,
        arrivalMinute: 30,
        daysBeforeFlight: 5,
        flightDayOfWeek: 3,
        travelDurationMinutes: 150,
        nearHoliday: true,
      };

      const predictionResponse: PredictionResponse = { prediction: 100 };

      mockedAxios.post.mockResolvedValue({
        data: predictionResponse,
      } as AxiosResponse<PredictionResponse>);

      const result = await service.predict(modelFeatures);

      expect(result).toEqual(predictionResponse);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        API_URLS.PREDICT,
        modelFeatures,
      );
    });

    it('should handle errors appropriately', async () => {
      const modelFeatures: ModelFeatures = {
        flightDay: 25,
        flightMonth: 12,
        departureHour: 10,
        departureMinute: 0,
        arrivalHour: 12,
        arrivalMinute: 30,
        daysBeforeFlight: 5,
        flightDayOfWeek: 3,
        travelDurationMinutes: 150,
        nearHoliday: true,
      };

      mockedAxios.post.mockRejectedValue(new Error('Network Error'));

      await expect(service.predict(modelFeatures)).rejects.toThrow(
        'Network Error',
      );
      expect(mockedAxios.post).toHaveBeenCalledWith(
        API_URLS.PREDICT,
        modelFeatures,
      );
    });
  });
});
