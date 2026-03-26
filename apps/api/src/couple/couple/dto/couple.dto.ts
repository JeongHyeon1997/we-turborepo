import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ConfirmCoupleDto {
  @IsString()
  inviteCode: string;
}

export class UpdateCoupleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coupleName?: string;

  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  @IsString()
  anniversaryDate?: string;
}
