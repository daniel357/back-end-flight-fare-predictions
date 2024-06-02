import { Test, TestingModule } from '@nestjs/testing';
import { PredictController } from './predict.controller';
import { PredictService } from './predict.service';
import { FlightDetails } from '../common/dto/flightDetails';
import { PredictionResponse } from '../common/interfaces/prediction.interface';

describe('PredictController', () => {
  let controller: PredictController;
  let service: PredictService;

  const mockPredictService = {
    getPrediction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PredictController],
      providers: [{ provide: PredictService, useValue: mockPredictService }],
    }).compile();

    controller = module.get<PredictController>(PredictController);
    service = module.get<PredictService>(PredictService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPrediction', () => {
    it('should return a prediction response', async () => {
      const flightDetails: FlightDetails = {
        arrivalMinute: 30,
        departureMinute: 0,
        flightDate: '2022-12-25',
        departureHour: 10,
        arrivalHour: 12,
        searchDate: '2022-12-20',
      };

      const predictionResponse: PredictionResponse = { prediction: 100 };
      jest
        .spyOn(service, 'getPrediction')
        .mockResolvedValue(predictionResponse);

      const result = await controller.getPrediction(flightDetails);

      expect(result).toEqual(predictionResponse);
      expect(service.getPrediction).toHaveBeenCalledWith(flightDetails);
    });
  });
});
