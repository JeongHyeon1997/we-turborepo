import { Controller, Get, Post, Put, Delete, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CoupleService } from './couple.service';
import { ConfirmCoupleDto, UpdateCoupleDto } from './dto/couple.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Couple')
@ApiBearerAuth()
@Controller('couple')
export class CoupleController {
  constructor(private readonly coupleService: CoupleService) {}

  @Get()
  @ApiOperation({ summary: '내 커플 정보 조회' })
  getCouple(@CurrentUser() userId: string) {
    return this.coupleService.getCouple(userId);
  }

  @Post('request')
  @ApiOperation({ summary: '초대 코드 생성' })
  createInvite(@CurrentUser() userId: string) {
    return this.coupleService.createInvite(userId);
  }

  @Post('confirm')
  @ApiOperation({ summary: '초대 코드로 커플 연결 확정' })
  confirmCouple(@CurrentUser() userId: string, @Body() dto: ConfirmCoupleDto) {
    return this.coupleService.confirmCouple(userId, dto);
  }

  @Put()
  @ApiOperation({ summary: '커플 정보 수정' })
  updateCouple(@CurrentUser() userId: string, @Body() dto: UpdateCoupleDto) {
    return this.coupleService.updateCouple(userId, dto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '커플 연결 해제' })
  disconnectCouple(@CurrentUser() userId: string) {
    return this.coupleService.disconnectCouple(userId);
  }
}
