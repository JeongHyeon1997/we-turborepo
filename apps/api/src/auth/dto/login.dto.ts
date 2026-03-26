import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'email', enum: ['email', 'oauth'] })
  @IsString()
  type: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: 'password123' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ example: 'KAKAO', enum: ['GOOGLE', 'KAKAO', 'NAVER'] })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({ example: 'oauth_access_token' })
  @IsOptional()
  @IsString()
  accessToken?: string;
}
