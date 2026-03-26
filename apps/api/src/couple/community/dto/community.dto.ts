import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;
}

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  content: string;
}

export class CreateReportDto {
  @ApiProperty()
  @IsString()
  reason: string;
}
