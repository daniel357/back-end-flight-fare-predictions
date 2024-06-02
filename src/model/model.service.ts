import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { API_URLS } from '../common/constants';
import { PredictionResponse } from '../common/interfaces/prediction.interface';
import { ModelFeatures } from '../common/dto/flightDetails';

@Injectable()
export class ModelService {
  async predict(features: ModelFeatures): Promise<PredictionResponse> {
    console.log(features);
    const response: AxiosResponse<PredictionResponse> = await axios.post(
      API_URLS.PREDICT,
      { ...features },
    );
    return { prediction: response.data.prediction };
  }
}
