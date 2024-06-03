import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsService } from './statistics.service';
import { firestore } from 'firebase-admin';
import Firestore = firestore.Firestore;

describe('StatisticsService', () => {
  let service: StatisticsService;
  let firestoreMock: jest.Mocked<Firestore>;
  let collectionMock: any;

  beforeEach(async () => {
    collectionMock = {
      orderBy: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        forEach: (
          callback: (doc: {
            data: () => {
              flightDate: { toDate: () => Date };
              baseFare: number;
              isHoliday: boolean;
            };
          }) => void,
        ) => {
          const docs = [
            {
              data: () => ({
                flightDate: { toDate: () => new Date('2023-06-01T00:00:00Z') },
                baseFare: 100,
                isHoliday: false,
              }),
            },
            {
              data: () => ({
                flightDate: { toDate: () => new Date('2023-05-01T00:00:00Z') },
                baseFare: 150,
                isHoliday: true,
              }),
            },
          ];
          docs.forEach(callback);
        },
      } as unknown as firestore.QuerySnapshot),
    };

    firestoreMock = {
      collection: jest.fn().mockReturnValue(collectionMock),
    } as unknown as jest.Mocked<Firestore>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: 'FIRESTORE',
          useValue: firestoreMock,
        },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAverageBaseFareData', () => {
    it('should retrieve average base fare data from Firestore', async () => {
      const result = await service.getAverageBaseFareData();

      expect(result).toEqual([
        {
          flightDate: '6/1/2023',
          baseFare: 100,
          isHoliday: false,
        },
        {
          flightDate: '5/1/2023',
          baseFare: 150,
          isHoliday: true,
        },
      ]);

      expect(firestoreMock.collection).toHaveBeenCalledWith(
        'averageFarePrices',
      );
      expect(collectionMock.orderBy).toHaveBeenCalledWith('flightDate', 'desc');
      expect(collectionMock.get).toHaveBeenCalled();
    });

    it('should handle Firestore errors gracefully', async () => {
      collectionMock.get.mockRejectedValueOnce(new Error('Firestore error'));

      await expect(service.getAverageBaseFareData()).rejects.toThrow(
        'Firestore error',
      );
    });
  });
});
