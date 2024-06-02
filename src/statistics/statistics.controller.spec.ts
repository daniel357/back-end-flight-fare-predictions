import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsController } from './statistics.controller';
import { AverageBaseFare, StatisticsService } from './statistics.service';
import { DATASET_FILE_PATH } from '../common/constants';

describe('StatisticsController', () => {
  let controller: StatisticsController;
  let service: StatisticsService;

  const mockStatisticsService = {
    getAverageBaseFareData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [
        { provide: StatisticsService, useValue: mockStatisticsService },
      ],
    }).compile();

    controller = module.get<StatisticsController>(StatisticsController);
    service = module.get<StatisticsService>(StatisticsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAverageBaseFare', () => {
    it('should return average base fare data', async () => {
      const averageBaseFareData: AverageBaseFare[] = [
        { flightDate: '2022-12-25', baseFare: 100.0, isHoliday: true },
        { flightDate: '2022-12-26', baseFare: 80.5, isHoliday: false },
      ];

      jest
        .spyOn(service, 'getAverageBaseFareData')
        .mockResolvedValue(averageBaseFareData);

      const result = await controller.getAverageBaseFare();

      expect(result).toEqual(averageBaseFareData);
      expect(service.getAverageBaseFareData).toHaveBeenCalledWith(
        DATASET_FILE_PATH,
      );
    });
  });
});
