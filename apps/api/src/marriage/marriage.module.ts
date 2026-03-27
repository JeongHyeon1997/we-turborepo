import { Module } from '@nestjs/common';
import { MarriageController } from './marriage.controller';
import { MarriageService } from './marriage.service';
import { MarriageDiaryController } from './diary/marriage-diary.controller';
import { MarriageDiaryService } from './diary/marriage-diary.service';

@Module({
  controllers: [MarriageController, MarriageDiaryController],
  providers: [MarriageService, MarriageDiaryService],
})
export class MarriageModule {}
