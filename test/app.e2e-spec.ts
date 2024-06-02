import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('PredictController', () => {
    it('/predict (POST)', () => {
      return request(app.getHttpServer())
        .post('/predict')
        .send({
          arrivalMinute: 30,
          departureMinute: 0,
          flightDate: '2022-12-25',
          departureHour: 10,
          arrivalHour: 12,
          searchDate: '2022-12-20',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual({
            prediction: expect.any(Number),
          });
        });
    });
  });

  describe('StatisticsController', () => {
    it('/statistics (GET)', () => {
      return request(app.getHttpServer())
        .get('/statistics')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                flightDate: expect.any(String),
                baseFare: expect.any(Number),
                isHoliday: expect.any(Boolean),
              }),
            ]),
          );
        });
    });
  });
});
