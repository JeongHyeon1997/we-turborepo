import { Module } from '@nestjs/common';
import { CoupleController } from './couple/couple.controller';
import { CoupleService } from './couple/couple.service';
import { CoupleDiaryController } from './diary/couple-diary.controller';
import { CoupleDiaryService } from './diary/couple-diary.service';
import { CoupleCommunityController } from './community/couple-community.controller';
import { CoupleCommunityService } from './community/couple-community.service';

@Module({
  controllers: [CoupleController, CoupleDiaryController, CoupleCommunityController],
  providers: [CoupleService, CoupleDiaryService, CoupleCommunityService],
})
export class CoupleModule {}
