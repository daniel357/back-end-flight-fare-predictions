import { Body, Controller, Post } from '@nestjs/common';
import { PredictService } from './predict.service';
import { FlightDetails } from '../common/dto/flightDetails';
import { PredictionResponse } from '../common/interfaces/prediction.interface';

@Controller('predict')
export class PredictController {
  constructor(private readonly predictService: PredictService) {}

  @Post()
  async getPrediction(
    @Body() flightDetails: FlightDetails,
  ): Promise<PredictionResponse> {
    console.log(flightDetails);
    return this.predictService.getPrediction(flightDetails);
  }
}
