import { Controller, Get, Post, Put, Delete, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MarriageService, ConfirmMarriageDto, UpdateMarriageDto } from './marriage.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Marriage')
@ApiBearerAuth()
@Controller('marriage')
export class MarriageController {
  constructor(private readonly marriageService: MarriageService) {}

  @Get()
  @ApiOperation({ summary: '부부 정보 조회' })
  getMarriage(@CurrentUser() userId: string) {
    return this.marriageService.getMarriage(userId);
  }

  @Post('request')
  @ApiOperation({ summary: '초대 코드 생성' })
  createInvite(@CurrentUser() userId: string) {
    return this.marriageService.createInvite(userId);
  }

  @Post('confirm')
  @ApiOperation({ summary: '초대 코드로 부부 연결 확정' })
  confirmMarriage(@CurrentUser() userId: string, @Body() dto: ConfirmMarriageDto) {
    return this.marriageService.confirmMarriage(userId, dto);
  }

  @Put()
  @ApiOperation({ summary: '부부 정보 수정' })
  updateMarriage(@CurrentUser() userId: string, @Body() dto: UpdateMarriageDto) {
    return this.marriageService.updateMarriage(userId, dto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '부부 연결 해제' })
  disconnectMarriage(@CurrentUser() userId: string) {
    return this.marriageService.disconnectMarriage(userId);
  }
}
