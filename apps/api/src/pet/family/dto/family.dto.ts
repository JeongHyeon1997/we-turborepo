import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFamilyDto {
  @ApiProperty({ example: '우리가족' })
  @IsString()
  name: string;
}

export class JoinFamilyDto {
  @ApiProperty()
  @IsString()
  inviteCode: string;
}
