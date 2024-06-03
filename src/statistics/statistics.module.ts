import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  providers: [StatisticsService],
  controllers: [StatisticsController],
  imports: [FirebaseModule],
})
export class StatisticsModule {}
