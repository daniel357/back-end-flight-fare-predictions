import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PredictModule } from './predict/predict.module';
import { ModelModule } from './model/model.module';
import { StatisticsModule } from './statistics/statistics.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule,
    PredictModule,
    ModelModule,
    StatisticsModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
