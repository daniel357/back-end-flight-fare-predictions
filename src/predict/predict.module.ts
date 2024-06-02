import { Module } from '@nestjs/common';
import { PredictService } from './predict.service';
import { PredictController } from './predict.controller';
import { ModelModule } from '../model/model.module';
import { HttpModule } from '@nestjs/axios';
import { ModelService } from '../model/model.service';

@Module({
  imports: [ModelModule, HttpModule],
  controllers: [PredictController],
  providers: [PredictService, ModelService],
})
export class PredictModule {}
