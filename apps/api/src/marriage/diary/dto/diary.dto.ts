import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMarriageDiaryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mood?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  moodLabel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  moodColor?: string;
}

export class UpdateMarriageDiaryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mood?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  moodLabel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  moodColor?: string;
}
