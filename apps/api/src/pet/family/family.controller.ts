import { Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FamilyService } from './family.service';
import { CreateFamilyDto, JoinFamilyDto } from './dto/family.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Pet Family')
@ApiBearerAuth()
@Controller('pet/family')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @Get()
  @ApiOperation({ summary: '가족 그룹 조회' })
  getFamily(@CurrentUser() userId: string) {
    return this.familyService.getFamily(userId);
  }

  @Post()
  @ApiOperation({ summary: '가족 그룹 생성' })
  createFamily(@CurrentUser() userId: string, @Body() dto: CreateFamilyDto) {
    return this.familyService.createFamily(userId, dto);
  }

  @Post('invite')
  @ApiOperation({ summary: '초대 코드 생성' })
  createInvite(@CurrentUser() userId: string) {
    return this.familyService.createInvite(userId);
  }

  @Post('join')
  @ApiOperation({ summary: '초대 코드로 그룹 참여' })
  joinFamily(@CurrentUser() userId: string, @Body() dto: JoinFamilyDto) {
    return this.familyService.joinFamily(userId, dto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '그룹 탈퇴' })
  leaveFamily(@CurrentUser() userId: string) {
    return this.familyService.leaveFamily(userId);
  }

  @Delete('members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '멤버 강퇴 (OWNER 전용)' })
  removeMember(@CurrentUser() userId: string, @Param('memberId') memberId: string) {
    return this.familyService.removeMember(userId, memberId);
  }
}
