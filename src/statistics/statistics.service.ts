import { Inject, Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as csv from 'csv-parser';
import { firestore } from 'firebase-admin';
import Firestore = firestore.Firestore;

export interface AverageBaseFare {
  flightDate: string;
  baseFare: number;
  isHoliday: boolean;
}

@Injectable()
export class StatisticsService {
  constructor(@Inject('FIRESTORE') private firestore: Firestore) {}

  async getAverageBaseFareData(): Promise<AverageBaseFare[]> {
    return await this.retrieveFromFirestore();
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

  private async saveToFirestore(data: AverageBaseFare[]): Promise<void> {
    const batch = this.firestore.batch();
    const collectionRef = this.firestore.collection('averageFarePrices');

    data.forEach((entry) => {
      const docRef = collectionRef.doc();
      const flightDateParts = entry.flightDate.split('/');
      const flightDate = new Date(
        Number(flightDateParts[2]),
        Number(flightDateParts[0]) - 1,
        Number(flightDateParts[1]),
      );
      batch.set(docRef, {
        ...entry,
        flightDate: firestore.Timestamp.fromDate(flightDate),
      });
    });

    await batch.commit();
  }

  private async retrieveFromFirestore(): Promise<AverageBaseFare[]> {
    const snapshot = await this.firestore
      .collection('averageFarePrices')
      .orderBy('flightDate', 'desc')
      .get();
    const data: AverageBaseFare[] = [];
    snapshot.forEach((doc) => {
      const docData = doc.data();
      data.push({
        flightDate: docData.flightDate.toDate().toLocaleDateString(),
        baseFare: docData.baseFare,
        isHoliday: docData.isHoliday,
      });
    });
    return data;
  }
}
