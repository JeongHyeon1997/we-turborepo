import { Module } from '@nestjs/common';
import { MarriageController } from './marriage.controller';
import { MarriageService } from './marriage.service';

@Module({
  controllers: [MarriageController],
  providers: [MarriageService],
})
export class MarriageModule {}
