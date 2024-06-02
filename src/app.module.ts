import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { PredictModule } from './predict/predict.module';
import { ModelModule } from './model/model.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [ConfigModule, PredictModule, ModelModule, StatisticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}