import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsService } from './statistics.service';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as csv from 'csv-parser';

jest.mock('fs');
jest.mock('csv-parser');

describe('StatisticsService', () => {
  let service: StatisticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatisticsService],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAverageBaseFareData', () => {
    it('should handle CSV parsing errors', async () => {
      const filePath = 'path/to/file.csv';
      const errorMessage = 'Error parsing CSV';

      // Mock the createReadStream function to return an empty readable stream
      const mockStream = new Readable({
        read() {
          this.push(null); // End the stream immediately
        },
      });

      (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

      // Mock the csv function to emit an error
      const mockCsvParser = jest.fn().mockImplementation(() => {
        const output = new Readable({ objectMode: true });
        process.nextTick(() => output.emit('error', new Error(errorMessage)));
        return output;
      });
      (csv as jest.Mock).mockImplementation(mockCsvParser);

      await expect(service.getAverageBaseFareData(filePath)).rejects.toThrow(
        errorMessage,
      );
    });
  });
});
