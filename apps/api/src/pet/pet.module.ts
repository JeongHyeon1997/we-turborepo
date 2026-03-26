import { Module } from '@nestjs/common';
import { FamilyController } from './family/family.controller';
import { FamilyService } from './family/family.service';
import { PetController } from './pet/pet.controller';
import { PetService } from './pet/pet.service';
import { PetDiaryController } from './diary/pet-diary.controller';
import { PetDiaryService } from './diary/pet-diary.service';
import { PetCommunityController } from './community/pet-community.controller';
import { PetCommunityService } from './community/pet-community.service';

@Module({
  controllers: [FamilyController, PetController, PetDiaryController, PetCommunityController],
  providers: [FamilyService, PetService, PetDiaryService, PetCommunityService],
})
export class PetModule {}
