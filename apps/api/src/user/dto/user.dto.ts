import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: '새닉네임' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  profileImageUrl?: string;
}

export class UserResponse {
  id: string;
  provider: string;
  email?: string | null;
  nickname: string;
  profileImageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
