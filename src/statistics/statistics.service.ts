import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as csv from 'csv-parser';

export interface AverageBaseFare {
  flightDate: string;
  baseFare: number;
  isHoliday: boolean;
}

@Injectable()
export class StatisticsService {
  async getAverageBaseFareData(filePath: string): Promise<AverageBaseFare[]> {
    return await this.parseCsv(filePath);
  }

  private async parseCsv(filePath: string): Promise<AverageBaseFare[]> {
    const rows: AverageBaseFare[] = [];

    return new Promise((resolve, reject) => {
      createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          rows.push({
            flightDate: row.flightDate,
            baseFare: parseFloat(row.baseFare),
            isHoliday: row.isHoliday.toLowerCase() === 'true',
          });
        })
        .on('end', () => resolve(rows))
        .on('error', reject);
    });
  }
}
