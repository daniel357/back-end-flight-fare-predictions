import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { DATASET_FILE_PATH } from '../common/constants';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  async getAverageBaseFare() {
    return await this.statisticsService.getAverageBaseFareData(
      DATASET_FILE_PATH,
    );
  }
}
